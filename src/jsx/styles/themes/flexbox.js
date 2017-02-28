
var flexboxStyle = function (opts, skin) {
  var colors;
  var isSafari = /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor);
  var skin = skin || opts.skin;

  switch (skin) {
  case "material-ui":
    colors = {
      activeButtonBackgroundColor: "#00bcd4",
      activeButtonColor: "#f72121",
      activeTabBackgroundColor: "#00bcd4",
      activeTabColor: "#ffffff",
      activeTabTextShadow: "initial",
      activeTabUnderlineColor: "#ff5722",
      buttonBackgroundColor: "#00bcd4",
      buttonColor: "#eaeaea",
      buttonTextShadow: "initial",
      contentBackgroundColor: "#ffffff",
      footerBackgroundColor: "#ffffff",
      hoverButtonBackgroundColor: "#00bcd4",
      hoverButtonColor: "#ffffff",
      hoverTabBackgroundColor: "#00bcd4",
      iconColor: "#ffffff",
      iconTextShadow: "initial",
      tabBackgroundColor: "#00bcd4",
      tabColor: "#ffffff",
      tabIconColor: "#616161",
      tabTextShadow: "initial",
      tabUnderlineColor: "#00bcd4",
      titleColor: "#ffffff",
      titleTextShadow: "initial",
      toolbarBackgroundColor: "#00bcd4",
    };
    break;

  case "fiery":
    colors = {
      tabColor: "#b0b0b0",
      tabIconColor: "#616161",
      activeTabColor: "#f72121",
      tabTextShadow: "#000000",
      activeTabTextShadow: "#000000",
      titleTextShadow: "#a6a6a6",
      iconTextShadow: "#000000",
      iconColor: "#ffffff",
      titleColor: "#ffffff",
      buttonBackgroundColor: "#202020",
      hoverButtonBackgroundColor: "#342828",
      activeButtonBackgroundColor: "#4d2c2c",
      buttonColor: "#eaeaea",
      hoverButtonColor: "#ffffff",
      activeButtonColor: "#f72121",
      buttonTextShadow: "#7F7F7F",
      tabBackgroundColor: "#202020",
      activeTabBackgroundColor: "#2e2e2e",
      hoverTabBackgroundColor: "#342828",
      toolbarBackgroundColor: "#4d2c2c",
      contentBackgroundColor: "#3e3e3e",
      footerBackgroundColor: "#4e4e4e",
      activeTabUnderlineColor: "#ffffff",
      tabUnderlineColor: "#000000",
    };
    break;

  default:
    colors = {
      tabColor: "#b0b0b0",
      tabIconColor: "#616161",
      activeTabColor: "#ffffff",
      tabTextShadow: "#000000",
      activeTabTextShadow: "#7F7F7F",
      titleTextShadow: "#a6a6a6",
      iconTextShadow: "#a6a6a6",
      iconColor: "#ffffff",
      titleColor: "#ffffff",
      buttonBackgroundColor: "#202020",
      hoverButtonBackgroundColor: "#2a2a2a",
      activeButtonBackgroundColor: "#4e4e4e",
      buttonColor: "#eaeaea",
      hoverButtonColor: "#ffffff",
      activeButtonColor: "#ffffff",
      buttonTextShadow: "#7F7F7F",
      tabBackgroundColor: "#202020",
      activeTabBackgroundColor: "#2e2e2e",
      hoverTabBackgroundColor: "#2a2a2a",
      toolbarBackgroundColor: "#4e4e4e",
      contentBackgroundColor: "#3e3e3e",
      footerBackgroundColor: "#4e4e4e",
      activeTabUnderlineColor: "#ffffff",
      tabUnderlineColor: "#000000",
    };
    break;
  }

  return {
    PanelWrapper: {
      config: {
        autocompact: false
      }
    },
    Panel: {
      style: {
        backgroundColor: "#00bcd4",
        padding: "0 4px 4px 4px",
        boxShadow: "rgba(0, 0, 0, 0.2) 0px 14px 45px, rgba(0, 0, 0, 0.2) 0px 10px 18px"
      },
      header: {
        style: {
          backgroundColor: "transparent",
          display: isSafari ? "-webkit-flex" : "flex",
          minWidth: "100%"
        }
      },
      tabsStart: {
        style: {
          width: 0
        }
      },
      tabsEnd: {
        style: {
          width: 0
        }
      },
      tabs: {
        style: {
          float: "none",
          WebkitFlex: "1",
          flex: 1,
          display: isSafari ? "-webkit-flex" : "flex",
          overflow: "hidden"
        }
      },
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: "2px 2px 2px " + colors.iconTextShadow,
          float: "left"
        }
      },
      box: {
        style: {
          float: "left"
        }
      },
      title: {
        style: {
          color: colors.titleColor,
          textShadow: "1px 1px 1px " + colors.titleTextShadow
        }
      },
      group: {
        style: {
          padding: 0,
          display: "inline-block",
          height: "100%",
          margin: 0
        }
      },
      body: {
        style: {
          marginLeft: "1px"
        }
      }
    },
    TabButton: {
      style: {
        textTransform: "uppercase",
        borderWidth: "0 0 2px 0",
        borderStyle: "solid",
        borderColor: colors.tabUnderlineColor,
        backgroundColor: colors.tabBackgroundColor,
        height: opts.headerHeight - 2,
        margin: "0 0 1px 1px",
        position: "inherit",
        float: "none",
        overflow: "hidden",
        WebkitFlex: "1",
        flex: "1 0 0px"
      },
      state: {
        hover: {
          style: {
            backgroundColor: colors.hoverTabBackgroundColor
          }
        }
      },
      mods: {
        active: {
          style: {
            borderColor: colors.activeTabUnderlineColor,
            backgroundColor: colors.activeTabBackgroundColor
          },
          state: {
            hover: {
              style: {
                backgroundColor: colors.activeTabBackgroundColor
              },
              icon: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.tabTextShadow
                }
              },
              title: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow,
                }
              }
            }
          },
          icon: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.tabTextShadow
            }
          },
          title: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          }
        }
      },
      icon: {
        style: {
          color: colors.tabIconColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      },
      title: {
        style: {
          textTransform: "uppercase",
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      },
      box: {
        style: {
          marginRight: 0,
          maxWidth: "calc(100% - " + Utils.pixelsOf(opts.headerHeight) + ")"
        }
      }
    },
    Tab: {
      toolbar: {
        style: {
          minHeight: 0,
          lineHeight: "inherit",
          padding: "0",
          display: "block",
          position: "relative",
          top: "-1px"
        },
        children: {
          style: {
            padding: "10px",
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            position: "relative",
            marginTop: "1px",
            backgroundColor: colors.toolbarBackgroundColor
          }
        }
      },
      content: {
        style: {
          backgroundColor: colors.contentBackgroundColor,
          marginBottom: "1px"
        }
      },
      footer: {
        style: {
          backgroundColor: colors.footerBackgroundColor,
          marginBottom: "1px"
        }
      }
    },
    Button: {
      style: {
        height: Utils.pixelsOf(opts.headerHeight - 1),
        backgroundColor: colors.buttonBackgroundColor,
        marginLeft: "1px"
      },
      children: {
        style: {
          color: colors.buttonColor,
          textShadow: "1px 1px 1px " + colors.buttonTextShadow
        }
      },
      state: {
        hover: {
          style: {
            backgroundColor: colors.hoverButtonBackgroundColor
          },
          children: {
            style: {
              color: colors.hoverButtonColor
            }
          }
        }
      },
      mods: {
        active: {
          style: {
            backgroundColor: colors.activeButtonBackgroundColor
          },
          children: {
            style: {
              color: colors.activeButtonColor
            }
          }
        }
      }
    }
  };
};
