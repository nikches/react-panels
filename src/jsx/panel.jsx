
var FloatingPanel = React.createClass({
  displayName: 'FloatingPanel',

  getDefaultProps: function () {
    return {
      "left": 0,
      "top": 0,
      "width": 420,
      "style": {}
    };
  },

  getInitialState: function () {
    this._pflag = true;

    return {
      left: parseInt(this.props.left),
      top: parseInt(this.props.top),
      width: parseInt(this.props.width)
    };
  },

  getSelectedIndex: function () {
    return this.refs.panel.getSelectedIndex();
  },

  setSelectedIndex: function (index) {
    this.refs.panel.setSelectedIndex(index);
    this._pflag = true;
    this.forceUpdate();
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
      e.dataTransfer.setData('text/plain', "Panel");
      e.dataTransfer.setDragImage(img, -1000, -1000);
    } catch (err) { /* Fix for IE */ }

    window.addEventListener('dragover', this.dragOver);
  },

  dragEnd: function() {
    delete this.panelBounds;
    window.removeEventListener('dragover', this.dragOver);
  },

  dragOver: function(e) {
    if (this.panelBounds || false) {
      var left = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX),
        top = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);
      this.setState({ left: left, top: top });
    }
  },

  render: function() {
    var self = this,
      transform = "translate3d(" + Utils.pixelsOf(self.state.left) + ", " + Utils.pixelsOf(self.state.top) + ", 0)",
      wrapperStyle = React.addons.update({
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: Utils.pixelsOf(self.state.width),
        position: "absolute"
      }, {$merge: self.props.style});

    if (self._pflag) {
      var props = React.addons.update(self.props, {$merge: {style: {}}});
      delete props.style;

      self.inner = (
        <Panel {...props} ref="panel" onDragStart={self.dragStart} onDragEnd={self.dragEnd} floating={true}>
          {self.props.children}
        </Panel>
      );
      self._pflag = false;
    }

    return (
      <div className="react-panel-wrapper" style={wrapperStyle}>
        {self.inner}
      </div>
    );
  }

});

var Panel = React.createClass({
  displayName: 'Panel',

  getDefaultProps: function () {
    return {
      "icon": false,
      "title": "",
      "selectedIndex": 0,
      "autocompact": true,
      "floating": false,
      "onDragStart": null,
      "onDragEnd": null,
      "maxTitleWidth": 130
    };
  },

  getInitialState: function () {
    var opts = {
      theme: this.props.theme,
      skin: this.props.skin,
      headerHeight: this.props.headerHeight,
      headerFontSize: this.props.headerFontSize,
      borderRadius: this.props.borderRadius,
      maxTitleWidth: this.props.maxTitleWidth
    };
    this._sheet = createSheet(opts);
    return {
      selectedIndex: parseInt(this.props.selectedIndex),
      compacted: (this.props.autocompact),
      theme: (typeof this.props.theme === "string") ? this.props.theme : "base"
    };
  },

  childContextTypes: {
    selectedIndex: React.PropTypes.number,
    sheet: React.PropTypes.func
  },

  getChildContext: function () {
    return {
      selectedIndex: this.state.selectedIndex,
      sheet: this._sheet
    };
  },

  getSelectedIndex: function () {
    return this.state.selectedIndex;
  },

  setSelectedIndex: function (index) {
    this.setState({selectedIndex: parseInt(index)});
    this.forceUpdate();
  },

  _getIcon: function () {
    var icon = null;

    if (this.props.icon) {
      icon = (
        <span className="panel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    return icon;
  },

  handleClick: function (event, index) {
    if (typeof this.props.onTabClick === "function") {
      if (this.props.onTabClick(index, this) !== false) {
        this.setSelectedIndex(index);
      }
    } else {
      this.setSelectedIndex(index);
    }
  },

  componentDidMount: function () {
    var tabsStart = this.refs['tabs-start'].getDOMNode(),
      tabsEnd = this.refs['tabs-end'].getDOMNode(),
      using = this.refs.tabs.getDOMNode().offsetWidth,
      total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth);

    if (using * 2 <= total) {   // TODO: ... * 2 is obviously not what it should be
      this.setState({compacted: false});
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var childs = React.Children.count(this.props.children),
      next_childs = React.Children.count(nextProps.children);

    if (next_childs > childs && this.props.autocompact && !this.state.compacted) {
      var tabsStart = this.refs['tabs-start'].getDOMNode(),
        tabsEnd = this.refs['tabs-end'].getDOMNode(),
        using = this.refs.tabs.getDOMNode().offsetWidth,
        total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth),
        maxTabWidth = this.props.maxTitleWidth + 35;

      if (using + maxTabWidth >= total) {
        this.setState({compacted: true});
      }
    } else {
      // TODO
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

  render: function() {
    var self = this,
      classes = "react-panel" + ((typeof this.props.theme === "string") ? " " + this.props.theme : ""),
      icon = this._getIcon(),
      title = (this.props.title.length) ? (
        <div className="panel-title-box" style={{maxWidth: Utils.pixelsOf(this.props.maxTitleWidth)}}><div className="panel-title">{this.props.title}</div></div>
      ) : null,
      draggable = (this.props.floating) ? "true" : "false";

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [];

    React.Children.forEach(self.props.children, function(child) {
      var ref = "tabb-" + tabIndex,
        tabRef = "tab-" + tabIndex,
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

      tabButtons.push(
        <TabButton key={tabIndex} title={props.title} icon={props.icon} selectedIndex={selectedIndex}
          index={tabIndex} ref={ref} showTitle={showTitle} onClick={self.handleClick} />
      );

      tabs.push(
        React.addons.cloneWithProps(child, {
          key: tabIndex,
          ref: tabRef,  // TODO: Remove if not being used
          selectedIndex: selectedIndex,
          index: tabIndex
        })
      );
      ++tabIndex;
    });

    return (
      <div className={classes}>
        <header draggable={draggable} onDragEnd={self.handleDragEnd} onDragStart={self.handleDragStart} ref="header">
          {icon}
          {title}
          <div className="panel-tabs-start" ref="tabs-start" />
          <ul className="panel-tabs" ref="tabs">
            {tabButtons}
          </ul>
          <div className="panel-tabs-end" ref="tabs-end" />
        </header>
        <div className="panel-body">
          {tabs}
        </div>
      </div>
    );
  }

});
