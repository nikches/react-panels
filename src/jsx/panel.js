var FloatingPanel = React.createClass({
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,

  displayName: "FloatingPanel",
  mixins: [Mixins.PanelWrapper],

  propTypes: {
    buttons: React.PropTypes.array,
    height: React.PropTypes.number,
    isFullscreen: React.PropTypes.bool,
    isResizable: React.PropTypes.bool,
    left: React.PropTypes.number,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    title: React.PropTypes.string,
    top: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getDefaultProps: function () {
    return {
      height: 500,
      isFullscreen: false,
      isResizable: false,
      left: 0,
      onClick: null,
      style: {},
      top: 0,
      width: 420,
    };
  },

  getInitialState: function () {
    this.wrapperRef = null;

    this.tempLeft = 0;
    this.tempTop = 0;
    this.tempWidth = 0;
    this.tempHeight = 0;

    return {
      top: parseInt(this.props.top),
      left: parseInt(this.props.left),
      width: parseInt(this.props.width),
      height: parseInt(this.props.height),
      floating: true,
      isDragModeOn: false,
      isResizeModeOn: false,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var width = this.state.width;

    if (nextProps.width !== undefined && nextProps.width !== null) {
      width = nextProps.width;
    }

    this.setState({
      width: width,
    });
  },

  dragStart: function (e) {
    this.panelBounds = {
      startLeft: this.state.left,
      startTop: this.state.top,
      startPageX: e.pageX,
      startPageY: e.pageY
    };

    try {
      var img = document.createElement("img");
      img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==";
      img.width = 1;
      e.dataTransfer.setData("text/plain", "Panel");
      e.dataTransfer.setDragImage(img, -1000, -1000);
    } catch (err) { /* Fix for IE */ }

    window.addEventListener("dragover", this.dragOver);

    this.tempTop = this.state.top;
    this.tempLeft = this.state.left;

    var newState = {
      isDragModeOn: true
    };

    if (this.props.isFullscreen === true) {
      newState.floating = false;
    }

    this.setState(newState);
  },

  dragEnd: function() {
    delete this.panelBounds;
    window.removeEventListener("dragover", this.dragOver);

    this.setState({
      top: this.tempTop,
      left: this.tempLeft,
      floating: true,
      isDragModeOn: false
    });
  },

  dragOver: function(e) {
    if (this.panelBounds || false) {
      this.tempLeft = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX);
      this.tempTop = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);

      if (this.wrapperRef !== null) {
        Object.assign(this.wrapperRef.style, this.getTransform(this.tempLeft, this.tempTop));
      }
    }
  },

  shouldComponentUpdate: function () {
    return (false === (this.state.isDragModeOn || this.state.isResizeModeOn));
  },

  handleMouseClick: function (e) {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(e);
    }
  },

  handleMouseDown: function() {
    if (this.props.isFullscreen === true) {
      return;
    }

    var mouseMoveEventListener = function(e) {
      if (this.wrapperRef !== null) {
        if (this.tempWidth + e.movementX < this.MIN_WIDTH || this.tempHeight + e.movementY < this.MIN_HEIGHT) {
          return;
        }

        this.tempWidth  += e.movementX;
        this.tempHeight += e.movementY;

        this.wrapperRef.style.width  = Utils.pixelsOf(this.tempWidth);
        this.wrapperRef.style.height = Utils.pixelsOf(this.tempHeight);
      }
    }.bind(this);

    var mouseUpEventListener = function() {
      document.removeEventListener("mouseup", mouseUpEventListener);
      document.removeEventListener("mousemove", mouseMoveEventListener);

      this.setState({
        width: this.tempWidth,
        height: this.tempHeight,
        isResizeModeOn: false,
      });

    }.bind(this);

    document.addEventListener("mouseup", mouseUpEventListener);
    document.addEventListener("mousemove", mouseMoveEventListener);

    this.tempWidth = this.state.width;
    this.tempHeight = this.state.height;

    this.setState({
      isResizeModeOn: true
    });
  },

  getTransform: function (left, top) {
    if (this.props.isFullscreen === true) {
      left = 0;
      top = 0;
    }

    var transform = "translate3d(" + Utils.pixelsOf(left) + ", " + Utils.pixelsOf(top)  + ", 0)";

    return {
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      transform: transform,
    };
  },

  render: function() {
    var inner = (React.createElement(ReactPanel, Object.assign({}, {
      key: "key0",
      floating: true,
      onDragStart: this.dragStart,
      onDragEnd: this.dragEnd,
      title: this.props.title,
      icon: this.props.icon,
      buttons: this.props.buttons,
    }, this.config), this.props.children));

    var corner = null;
    if (this.props.isResizable === true) {
      corner = React.createElement("div", {
        key: "key1",
        onMouseDown: this.handleMouseDown,
        style: {
          position: "absolute",
          right: "0",
          bottom: "-8px",
          cursor: "se-resize",
          border: "10px solid #00bcd4",
          borderLeft: "10px solid transparent",
          borderTop: "10px solid transparent",
        },
      });
    }

    var fullscreenStyle = {};
    if (this.props.isFullscreen === true) {
      fullscreenStyle = {
        width: "100%",
        height: "100%"
      };
    }

    return React.createElement("div", {
      ref: function (reference) {
        this.wrapperRef = reference;
      }.bind(this),

      style: Object.assign({}, {
        position: "fixed",
        width: Utils.pixelsOf(this.state.width),
        height: Utils.pixelsOf(this.state.height),
        minWidth: Utils.pixelsOf(this.MIN_WIDTH),
        minHeight: Utils.pixelsOf(this.MIN_HEIGHT),
      },

      this.props.style,
      this.getTransform(this.state.left, this.state.top),
      fullscreenStyle),

      onClick: this.handleMouseClick,
    }, [ inner, corner ]);
  }
});

var Panel = React.createClass({
  displayName: "Panel",
  mixins: [Mixins.PanelWrapper],

  render: function() {
    var props = update({}, {$merge: this.config});
    var keys = Object.keys(this.props);

    for (var i = keys.length; --i >= 0;) {
      if (["children"].indexOf(keys[i]) != -1) continue;
      props[keys[i]] = this.props[keys[i]];
    }

    return React.createElement(ReactPanel, props,
        this.props.children
    );
  }

});

var ReactPanel = React.createClass({
  displayName: "ReactPanel",
  mixins: [Mixins.Styleable, Mixins.Transitions],

  propTypes: {
    dragAndDropHandler: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.bool
    ])
  },

  getDefaultProps: function () {
    return {
      "icon": false,
      "title": "",
      "autocompact": true,
      "floating": false,
      "onDragStart": null,
      "onDragEnd": null,
      "maxTitleWidth": 130,
      "buttons": [],
      "leftButtons": []
    };
  },

  getInitialState: function () {
    return {
      compacted: (this.props.autocompact)
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    sheet: React.PropTypes.func,
    onTabChange: React.PropTypes.func,
    globals: React.PropTypes.object
  },

  getSelectedIndex: function () {
    return this.context.selectedIndex;
  },

  handleClick: function (event, index) {
    this.context.onTabChange(parseInt(index));
  },

  componentDidMount: function () {
    if (this.props.autocompact) {
      var tabsStart = this.refs["tabs-start"];
      var tabsEnd = this.refs["tabs-end"];
      var using = this.refs.tabs.offsetWidth;
      var total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth);

      if (using * 2 <= total) {   // TODO: ... * 2 is obviously not what it should be
        this.setState({compacted: false});
      }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.autocompact) {
      var childs = React.Children.count(this.props.children),
        next_childs = React.Children.count(nextProps.children);

      if (next_childs > childs && this.props.autocompact && !this.state.compacted) {
        var tabsStart = this.refs["tabs-start"],
          tabsEnd = this.refs["tabs-end"],
          using = this.refs.tabs.offsetWidth,
          total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth),
          maxTabWidth = this.props.maxTitleWidth + 35;

        if (using + maxTabWidth >= total) {
          this.setState({compacted: true});
        }
      } else {
        // TODO
      }
    }
  },

  handleDragStart: function (e) {
    if (typeof this.props.onDragStart === "function") {
      this.props.onDragStart(e);
    }
  },

  handleDragEnd: function () {
    if (typeof this.props.onDragEnd === "function") {
      this.props.onDragEnd();
    }
  },

  _getGroupedButtons: function (buttons) {
    var len = buttons.length,
      i, j, item, group = [], groups = [];

    for (i = 0; i < len; ++i) {
      item = buttons[i];

      if (typeof item === "object" && item instanceof Array) {
        if (group.length) {
          groups.push(group);
          group = [];
        }
        for (j = 0; j < item.length; ++j) {
          group.push(React.cloneElement(item[j], {key: j}));
        }
        if (group.length) {
          groups.push(group);
          group = [];
        }
      } else {
        group.push(React.cloneElement(item, {key: i}));
      }
    }
    if (group.length) {
      groups.push(group);
    }

    return groups;
  },

  render: function() {
    var self = this,
      draggable = (this.props.floating) ? "true" : "false",
      sheet = this.getSheet("Panel"),
      transitionProps = this.getTransitionProps("Panel");

    var icon = (this.props.icon) ? (
        React.createElement("span", {style:sheet.icon.style},
          React.createElement("i", {className:this.props.icon})
        )
      ) : null,
      title = (this.props.title.length) ? (
        React.createElement("div", {style:sheet.box.style},
          React.createElement("div", {style:sheet.title.style},
            this.props.title
          )
        )
      ) : null;

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [],
      groupIndex = 0;

    React.Children.forEach(self.props.children, function(child) {
      var ref = "tabb-" + tabIndex,
        tabKey = (typeof child.key !== "undefined" && child.key != null) ? child.key : ref,
        showTitle = true,
        props = {
          "icon": child.props.icon,
          "title": child.props.title,
          "pinned": child.props.pinned
        };

      if (self.state.compacted) {
        if (!(props.pinned || selectedIndex == tabIndex)) {
          showTitle = false;
        }
      }

      tabButtons.push({
        key: tabKey, title: props.title, icon: props.icon, index: tabIndex, ref: ref, showTitle: showTitle,
        onClick: self.handleClick, "data-index": tabIndex, "data-key": tabKey
      });

      tabs.push(
        React.cloneElement(child, {
          key: tabKey,
          tabKey: tabKey,
          selectedIndex: selectedIndex,
          index: tabIndex
        })
      );
      ++tabIndex;
    });

    return (
      React.createElement("div", {style: sheet.style},
        React.createElement("header", {draggable: draggable, onDragEnd: self.handleDragEnd,
          onDragStart: self.handleDragStart, ref: "header", style: sheet.header.style},
          icon, title,
          React.createElement("div", {style: sheet.tabsStart.style, ref: "tabs-start"}),
          this._getGroupedButtons(this.props.leftButtons).map(function (group) {
            return React.createElement("ul", {style: sheet.group.style, key: groupIndex++}, group );
          }),
          React.createElement(TabGroup, {
            style: sheet.tabs.style, ref: "tabs", data: tabButtons,
            dragAndDropHandler: this.props.dragAndDropHandler || false,
            transitionProps: transitionProps
          }),
          React.createElement("div", {style: sheet.tabsEnd.style, ref: "tabs-end"}),
          this._getGroupedButtons(this.props.rightButtons||this.props.buttons).map(function (group) {
            return React.createElement("ul", {style: sheet.group.style, key: groupIndex++}, group );
          })
        ),
        React.createElement("div", {style: sheet.body.style}, tabs )
      )
    );
  }

});
