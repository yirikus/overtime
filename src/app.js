import React from 'react';
import ReactDOM from 'react-dom';
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
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = props.store.getState();

    const onFilterClick = () =>
      props.store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: props.filter });

    return <Link active={props.filter === state.visibilityFilter}
      onClick={onFilterClick}>{props.children}</Link>
  }
}

const Todo = ({
  onClick,
  completed,
  text
}) => (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>{text}</li>
  );

const TodoList = ({
  todos,
  onTodoClick
}) => (
    <ul>
      {todos.map(todo =>
        <Todo key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)} />
      )}
    </ul>
  );


  const getVisibleTodos = (
    todos,
    filter
  ) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
    }
  }
class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = props.store.getState();

    const visibleTodos = getVisibleTodos(
      state.todos,
      state.visibilityFilter);

    const onTodoClick = id =>
      props.store.dispatch({ type: 'TOGGLE_TODO', id });

    return (
      <TodoList
        todos={visibleTodos}
        onTodoClick={onTodoClick}
      />
    );
  }
}

const Footer = ({ store }) => (

  <p>show: {' '}
    <FilterLink filter='SHOW_ALL' store={store}>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE' store={store}>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED' store={store}>Completed</FilterLink>{' '}
  </p>
);

const AddTodo = ({
  store
}) => {
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

const App = ({
  store
}) => (
    <div>
      <AddTodo store={store} />
      <VisibleTodoList store={store} />
      <Footer store={store} />
    </div>
  );
export default App;
