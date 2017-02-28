var TabGroup = React.createClass({
  displayName: "TabGroup",

  propTypes: {
    style: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    transitionProps: React.PropTypes.object.isRequired,
    dragAndDropHandler: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.bool
    ])
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    sheet: React.PropTypes.func,
    onTabChange: React.PropTypes.func,
    globals: React.PropTypes.object
  },

  componentWillMount: function () {
    this.tabKeys = [];
    this._index = false;

    var globals = (this.context && this.context.globals) ? this.context.globals.Panel || {} : {};
    this.handler = this.props.dragAndDropHandler || globals.dragAndDropHandler || false;
    this.ctx = this.handler ? this.handler.ctx : {
      sortable: false,
      dragging: false
    };

    for (var i = 0; i < this.props.data.length; ++i) {
      this.tabKeys.push(this.props.data[i]["data-key"]);
    }
    this.keyMap = this.tabKeys.slice(0);
    this.constKeyMap = this.tabKeys.slice(0); //req. don"t try to merge
  },

  componentDidMount: function () {
    if (this.ctx.sortable && this.handler) {
      this.memberId = this.handler.addMember(this);
    }
  },

  componentWillUpdate: function (nextProps) {
    if (!this.ctx.dragging) {
      this.tabKeys = [];

      for (var i = 0; i < nextProps.data.length; ++i) {
        this.tabKeys.push(nextProps.data[i]["data-key"]);
      }
      this.keyMap = this.tabKeys.slice(0);
      this.constKeyMap = this.tabKeys.slice(0);
    }
  },

  handleDragStartOnTab: function(e, clone, target) {
    this.ctx.draggedKey = target.dataset.key;
    this.ctx.keySequence = 0;
    this.ctx.dragging = false;  //
    this.ctx.draggedElement = clone;
    this.ctx.dragging = true;
    this._index = this.tabKeys.indexOf(this.ctx.draggedKey);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", target);
    e.dataTransfer.setDragImage(target, -15, -15);
  },

  handleDragStart: function(e) {
    if (this.ctx.sortable) {

      var node = ReactDOM.findDOMNode(this);
      var tabWidth = node.offsetWidth / this.tabKeys.length;
      var distance = e.pageX - node.getBoundingClientRect().left;
      var index = parseInt(distance / tabWidth);
      var targetKey = this.tabKeys[index] || false;

      if (targetKey !== false) {
        var tabComponent = this.refs[targetKey + "-tabbref"] || false;
        if (tabComponent !== false) {
          this.ctx.ownerId = this.ctx.parentId = this.memberId || false;
          var clone = React.cloneElement(tabComponent.render(), {
            key: "tabbph-clone",
            onMouseEnter: false,
            onMouseLeave: false
          });
          this.keyMap.splice(index, 1);
          this.acquireToken(e); //
          this.handleDragStartOnTab(e, clone, ReactDOM.findDOMNode(tabComponent));
        }
      }
    }
  },

  handleDragOver: function(e) {
    if (this.ctx.dragging) {
      e.preventDefault();
      var nextIndex;

      if (this.ctx.parentId != this.memberId) {
        //tab not present in this panel
        nextIndex = this.acquireToken(e);
        this._index = false;
        this.handler.setParentOfToken(this.memberId);
      } else {
        var distance = e.pageX - ReactDOM.findDOMNode(this).getBoundingClientRect().left;
        nextIndex = parseInt(distance / this.tabWidth);
      }

      if (this._index !== nextIndex) {
        this.ctx.keySequence++;
        if (this._index !== false) {
          this.tabKeys.splice(this._index, 1);
        }
        this.tabKeys.splice(nextIndex, 0, this.ctx.draggedKey);
        this._index = nextIndex;

        this.ctx.targetKey = this.keyMap[Math.min(this._index, this.keyMap.length - 1)] || false;
        this.ctx.placement = this._index >= this.keyMap.length ? "after" : "before";
        this.forceUpdate();
      }
    }
  },

  handleDragEnd: function(e) {
    if (this.ctx.dragging) {
      this.ctx.dragging = false;
      this._index = this._index || this.acquireToken(e);
      this.handler.trigger("onDragEnd", {
        element: this.ctx.draggedKey,
        target: this.ctx.targetKey,
        placement: this.ctx.placement
      });
    }
  },

  /* TODO: proper name. */
  acquireToken: function (e) {
    var node = ReactDOM.findDOMNode(this),
      numTabsMod = this.ctx.ownerId == this.memberId ? 0 : 1,
      tabWidth = node.offsetWidth / (this.tabKeys.length + numTabsMod),
      distance = e.pageX - node.getBoundingClientRect().left,
      index = parseInt(distance / tabWidth);

    this.tabWidth = tabWidth;
    return index;
  },

  releaseToken: function () {
    this._index = false;
    //TODO: Something is missing here.
  },

  /* Should be used by opts.cloakInGroup once implemented. */
  cloneTabComponent: function (e) {
    /*
    var tabComponent = this.refs[(this.tabKeys[index] || false) + "-tabbref"] || false;
    if (tabComponent !== false) {
      this.ctx.draggedElement = React.cloneElement(tabComponent.render(), {
        key: "tabbph-clone",
        onMouseEnter: false,
        onMouseLeave: false
      });
    }
    */
  },

  createTabElement: function (tabKey) {
    if (this.ctx.dragging) {
      if (this.ctx.draggedKey === tabKey) {
        return React.cloneElement(this.ctx.draggedElement, {
          key: tabKey + "-tabbph" + this.ctx.keySequence,
          draggable: false
        });
      }
    }
    var tabProps = this.props.data[this.constKeyMap.indexOf(tabKey)] || false;

    return (tabProps === false) ? null : React.createElement(
      TabButton, Object.assign({}, tabProps, {ref: tabKey + "-tabbref"})
    );
  },

  render: function () {
    var tp = this.props.transitionProps,
      sp = (this.ctx.sortable || false) ? {
        draggable: true,
        onDragEnd: this.handleDragEnd,
        onDragStart: this.handleDragStart,
        onDragOver: this.handleDragOver,
        "data-key": "get-target-stop"
      } : {};

    if (!this.ctx.dragging) {
      this.tabKeys = [];

      for (var i = 0; i < this.props.data.length; ++i) {
        this.tabKeys.push(this.props.data[i]["data-key"]);
      }
    }

    var tabs = this.tabKeys.map(function (tabKey) {
      return this.createTabElement(tabKey);
    }.bind(this));

    return (
      React.createElement(tp.transitionComponent, Object.assign({}, {component: "ul",
        style: this.props.style, transitionName: tp.transitionName,
        transitionAppear: tp.transitionAppear, transitionEnter: tp.transitionEnter,
        transitionLeave: tp.transitionLeave}, tp.transitionCustomProps, sp),
        tabs
      )
    );
  }

});

var TabButton = React.createClass({
  mixins: [Mixins.StyleableWithEvents],

  propTypes: {
    "data-index": React.PropTypes.number.isRequired,
    "data-key": React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "showTitle": true
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    numTabs: React.PropTypes.number
  },

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(event, this.props.index);
  },

  render: function() {
    var icon = null,
      title = "",
      mods = (this.context.selectedIndex == this.props.index) ? ["active"] : [];

    if (!(this.props.showTitle && this.props.title.length)) mods.push("untitled");
    if (this.props.index == this.context.numTabs - 1) mods.push("last");
    var sheet = this.getSheet("TabButton", mods, {});

    if (this.props.showTitle && this.props.title.length) {
      title = React.createElement("div", {style:sheet.title.style},this.props.title);
    }

    if (this.props.icon) {
      icon = (
        React.createElement("div", {style:sheet.icon.style},
          React.createElement("i", {className:this.props.icon})
        )
      );
    }

    return (
      React.createElement("li", Object.assign({}, {
        onClick: this.handleClick,
        style: sheet.style,
        "data-index": this.props["data-index"],
        "data-key": this.props["data-key"]
      }, this.listeners),
        React.createElement("div", {title: this.props.title},
          icon, React.createElement("div", {style: sheet.box.style}, title)
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: "Tab",
  mixins: [Mixins.Styleable, Mixins.Transitions],

  propTypes: {
    onActiveChanged: React.PropTypes.func,
    maxContentHeight: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "pinned": false,
      "showToolbar": true,
      "showFooter": true,
      "panelComponentType": "Tab",
      "automount": false,
      "maxContentHeight": 0
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    index: React.PropTypes.number,
    globals: React.PropTypes.object
  },

  componentDidMount: function () {
    this._doEvents();
  },

  componentDidUpdate: function () {
    this._doEvents();
  },

  _doEvents: function () {
    if (typeof this.props.onActiveChanged === "function") {
      this.wasActive = this.wasActive || false;
      var active = this.isActive();
      if (this.wasActive != active) {
        this.props.onActiveChanged(this, active);
        this.wasActive = active;
      }
    }
  },

  getValue: function (name) {
    switch (name) {
    case "index":
      return (typeof this.props.index !== "undefined") ? this.props.index : this.context.index;

    case "selectedIndex":
      return this.context.selectedIndex;

    case "showToolbar":
      return this.props.showToolbar;

    case "showFooter":
      return this.props.showFooter;

    case "active":
      return this.isActive();

    case "hasToolbar":
      return this.hasToolbar || false;

    case "hasFooter":
      return this.hasFooter || false;

    case "mounted":
      return this.mounted || false;

    case "automount":
      return this.props.automount;

    case "numChilds":
      return React.Children.count(this.props.children);

    case "tabKey":
      return (typeof this.props.tabKey !== "undefined") ? this.props.tabKey : this.context.tabKey;
    }
  },

  isActive: function () {
    if (typeof this.props.index !== "undefined") {
      return (this.props.index == this.context.selectedIndex);
    } else {
      return (this.context.index == this.context.selectedIndex);
    }
  },

  render: function() {
    var self = this,
      numChilds = React.Children.count(this.props.children),
      active = this.isActive(),
      tp = this.getTransitionProps(),
      mods = (active) ? ["active"] : [],
      sheet = {};

    this.mounted = (this.mounted || false) || this.props.automount || active;
    this.hasToolbar=this.hasFooter=false;

    var innerContent = (this.mounted) ? React.Children.map(self.props.children, function(child, i) {
      var type = (i == 0 && numChilds >= 2) ? 0 : 1;   // 0: Toolbar, 1: Content, 2: Footer
      if (React.isValidElement(child) && (typeof child.props.panelComponentType !== "undefined")) {
        switch (String(child.props.panelComponentType)) {
        case "Toolbar": type = 0; break;
        case "Content": type = 1; break;
        case "Footer": type = 2; break;
        }
      }
      if (i == 0) {
        if (type == 0) {
          this.hasToolbar = true;
          if (self.props.showToolbar) mods.push("withToolbar");
        }
        sheet = self.getSheet("Tab", mods);
      }
      if (i == self.props.children.length-1 && type == 2) {
        this.hasFooter = true;
        if (self.props.showFooter) {
          mods.push("withFooter");
          sheet = self.getSheet("Tab", mods);
        }
      }
      switch (type) {
      case 0:
        return (self.props.showToolbar) ? (
          React.createElement("div", {key: i, style: sheet.toolbar.style},
            React.createElement("div", {className: "tab-toolbar", style: sheet.toolbar.children.style},
              child
            )
          )
        ) : null;
      case 1:
        var contentStyle = update({
          maxHeight : this.props.maxContentHeight || "none",
          overflowX :"hidden",
          overflowY : this.props.maxContentHeight?"auto":"hidden"
        }, {$merge: sheet.content.style});

        return (
          React.createElement("div", {key: i, style: contentStyle},
            React.createElement("div", {className: "tab-content", style: sheet.content.children.style},
              child
            )
          )
        );
      case 2:
        return (self.props.showFooter) ? (
          React.createElement("div", {key: i, style: sheet.footer.style},
            React.createElement("div", {className: "tab-footer", style: sheet.footer.children.style},
              child
            )
          )
        ) : null;
      }
    }.bind(this)) : null;

    return (
      React.createElement(tp.transitionComponent, Object.assign({}, {component: "div", style: sheet.style,
        transitionName: tp.transitionName, transitionAppear: tp.transitionAppear && active,
        transitionEnter: tp.transitionEnter && active, transitionLeave: tp.transitionLeave && active},
        tp.transitionCustomProps),
        innerContent
      )
    );

  }

});
