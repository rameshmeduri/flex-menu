import React, { PureComponent, createRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from 'lodash-es';
import './styles.scss';

class FlexMenu extends PureComponent {
  state = {
    navItems: [],
    overflowItems: [],
    dropdownVisible: false
  };

  mainNavRef = createRef();

  dropdownRef = createRef();

  componentDidMount() {
    const mainNav = this.mainNavRef.current;

    const navItems = [...React.Children.toArray(this.props.children)];
    this.setState({ navItems });
    let delay = 100;
    if (this.props.delay != null) {
      delay = this.props.delay;
    }
    const debouncedHandleSize = debounce(this.handleSize, delay, {
      leading: true
    });
    if (mainNav != null) {
      this.ro = new ResizeObserver(() => debouncedHandleSize());
      this.ro.observe(mainNav);
    }
  }

  componentWillUnmount() {
    this.ro.disconnect();
  }

  moveToOverflow = () => {
    this.setState(
      (state) => {
        const navItems = [...state.navItems];
        if (!navItems.length) return {};

        const lastItem = navItems.pop();
        const overflowItems = [lastItem, ...state.overflowItems];
        return { navItems, overflowItems };
      },
      () => this.handleSize()
    );
  };

  moveToNav = () => {
    this.setState(
      (state) => {
        const [head, ...overflowItems] = state.overflowItems;
        const navItems = [...state.navItems, head];
        return { navItems, overflowItems };
      },
      () => this.handleSize()
    );
  };

  overflows = () => {
    const mainNav = this.mainNavRef.current;
    if (mainNav === null) {
      return false;
    }
    const { navItems } = this.state;
    let { minItems } = this.props;
    if (minItems === null) {
      minItems = 1;
    }
    if (navItems.length <= minItems) {
      return false;
    }
    const { scrollWidth, clientWidth } = mainNav;
    return scrollWidth > clientWidth;
  };

  spaceAvail = () => {
    const mainNav = this.mainNavRef.current;
    const overflowNav = this.dropdownRef.current;
    const { navItems, overflowItems } = this.state;
    if (overflowItems.length === 0) {
      return false;
    }
    if (mainNav === null || overflowNav === null) {
      return false;
    }
    const { clientWidth } = mainNav;
    const minItemWidth = overflowNav.firstChild.offsetWidth;
    const numItemsToFit = navItems.length + 1;
    const reqWidth = numItemsToFit * minItemWidth;
    return clientWidth > reqWidth;
  };

  handleSize = () => {
    if (this.overflows()) {
      return this.moveToOverflow();
    }
    if (this.spaceAvail()) {
      return this.moveToNav();
    }
  };

  toggleDropdown = () => {
    this.setState((state) => ({ dropdownVisible: !state.dropdownVisible }));
  };

  renderButton = () => {
    const buttonVisible = !!this.state.overflowItems.length;
    const button = buttonVisible && (
      <button
        type="button"
        className="more_button"
        onClick={this.toggleDropdown}
      >
        &#8942;
      </button>
    );
    return button;
  };

  renderDropdown = () => {
    const style = {
      visibility: this.state.dropdownVisible ? 'visible' : 'hidden'
    };
    return (
      <nav ref={this.dropdownRef} style={style}>
        {this.state.overflowItems}
      </nav>
    );
  };

  render() {
    const { navItems } = this.state;
    return (
      <div className="flex_menu_container">
        <nav ref={this.mainNavRef}>{navItems}</nav>
        {this.renderButton()}
        {this.renderDropdown()}
      </div>
    );
  }
}

export default FlexMenu;
