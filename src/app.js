import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import VisibleTodoList from './Todolist'
import './index.css';

let nextId = 0;

const Link = ({
  active,
  children,
  onClick
}) => {
  const handleClick = e => {
    e.preventDefault();
    onClick();
  };

  if (active) {
    return (<span>{children}</span>);
  }

  return (
    <a href="#"
      onClick={handleClick}>
      {children}
    </a>
  );
};

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    const onFilterClick = () =>
      store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: props.filter });

    return <Link active={props.filter === state.visibilityFilter}
      onClick={onFilterClick}>{props.children}</Link>
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Footer = () => (

  <p>show: {' '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>{' '}
  </p>
);

/**
 * 
 * @param {*} props 
 * @param {*} context context is always after props!
 */
const AddTodo = (props, {store}) => {
  let input;

  const onAddClick = (text) => {
    store.dispatch({
      type: 'ADD_TODO',
      text: input.value,
      id: nextId++
    });
    input.value = '';
  };

  return (
    <div>
      <input ref={node => { input = node; }} />
      <button onClick={onAddClick}>add</button>
    </div>
  );
}
AddTodo.contextTypes = {
  store: React.PropTypes.object
};

const App = () => (
    <div>
      <AddTodo/>
      <VisibleTodoList/>
      <Footer/>
    </div>
  );
export default App;
