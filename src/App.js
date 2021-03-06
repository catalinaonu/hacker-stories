import React, { useState } from "react";
import "./App.css";

const App = () => {
  const initialStories = [
    {
      title: "React",
      url: "https:reactjs.org",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https:redux.js.org",
      author: "Dan Abramov, andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then((result) => {
      setStories(result.data.stories);
      console.log("result.data.stories", result.data.stories);
      setIsLoading(false);
    })
    .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item) => {
    console.log("item", item);
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );

    setStories(newStories);
    console.log("item.objectID", item.objectID);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {
    return story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <h1> My Hacker Stories </h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        type="text"
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => {
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

export default App;
