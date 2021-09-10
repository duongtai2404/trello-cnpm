import shortid from "shortid";

export default function seed(store) {
  console.log("Insert first user");
  store.dispatch({
    type: "ADD_USER",
    payload: {userName: "admin", password: "123456"}
  });

  console.log("Insert first board user admin");
  const firstBoardId = shortid.generate();
  store.dispatch({
    type: "ADD_BOARD",
    payload: {userName: "admin", boardId: firstBoardId, boardTitle: "Task 1"}
  });

  // console.log("Insert second board user admin");
  // const secondBoardId = shortid.generate();
  // store.dispatch({
  //   type: "ADD_BOARD",
  //   payload: {userName: "admin", boardId: secondBoardId, boardTitle: "Task 2"}
  // });

  console.log("Insert first list");
  const firstListId = shortid.generate();
  store.dispatch({
    type: "ADD_LIST",
    payload: { boardId: firstBoardId,listId: firstListId, listTitle: "First list" }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "First card"
    }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: firstListId,
      cardId: shortid.generate(),
      cardText: "Second card"
    }
  });


  console.log("Insert second list");
  const secondListId = shortid.generate();
  store.dispatch({
    type: "ADD_LIST",
    payload: { boardId: firstBoardId,listId: secondListId, listTitle: "Second list" }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: secondListId,
      cardId: shortid.generate(),
      cardText: "Card 1"
    }
  });

  store.dispatch({
    type: "ADD_CARD",
    payload: {
      listId: secondListId,
      cardId: shortid.generate(),
      cardText: "Card 2"
    }
  });
};
