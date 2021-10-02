import { combineReducers, createStore } from 'redux';
import throttle from 'lodash.throttle';
import seed from './seed';

const user = (state = { lists: [] }, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      const { userName } = action.payload;
      return { lists: [...state.lists, userName] };
    }
    default:
      return state;
  }
};

const usersById = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      const { userName, password } = action.payload;
      return {
        ...state,
        [userName]: { userName: userName, password: password, listBoard: [] },
      };
    }
    case 'ADD_BOARD': {
      const { userName, boardId } = action.payload;
      return {
        ...state,
        [userName]: {
          ...state[userName],
          listBoard: [...state[userName].listBoard, boardId],
        },
      };
    }
    case 'ADD_MEMBER': {
      const { userName, boardId } = action.payload;
      return {
        ...state,
        [userName]: {
          ...state[userName],
          listBoard: [...state[userName].listBoard, boardId],
        },
      };
    }
    case 'SET_NEWBOARD': {
      const { userName, boardId } = action.payload;
      return {
        ...state,
        [userName]: {
          ...state[userName],
          newBoard: boardId,
          listBoard: [...state[userName].listBoard, boardId],
        },
      };
    }
    case 'ACCEPT_NEWBOARD': {
      const { userName } = action.payload;
      return {
        ...state,
        [userName]: {
          ...state[userName],
          newBoard: '',
        },
      };
    }
    case 'DELETE_MEMBER': {
      const { userName, boardId } = action.payload;
      const filterDeleted = (tmpBoardId) => tmpBoardId !== boardId;
      const newLists = state[userName].listBoard.filter(filterDeleted);
      return {
        ...state,
        [userName]: { ...state[userName], listBoard: newLists },
      };
    }
    default:
      return state;
  }
};

// const board = (state = { lists: [] }, action) => {
//   switch (action.type) {
//     case "ADD_BOARD": {
//       const {boardId, boardTitle} = action.payload;
//       return { ...state,
//         [boardId]: {boardId: boardId, boardTitle: boardTitle, lists: []}
//       }
//     }
//     case "ADD_LIST": {
//       const { listId } = action.payload;
//       return { lists: [...state.lists, listId] };
//     }
//     case "MOVE_LIST": {
//       const { oldListIndex, newListIndex } = action.payload;
//       const newLists = Array.from(state.lists);
//       const [removedList] = newLists.splice(oldListIndex, 1);
//       newLists.splice(newListIndex, 0, removedList);
//       return { lists: newLists };
//     }
//     case "DELETE_LIST": {
//       const { listId } = action.payload;
//       const filterDeleted = tmpListId => tmpListId !== listId;
//       const newLists = state.lists.filter(filterDeleted);
//       return { lists: newLists };
//     }
//     default:
//       return state;
//   }
// };

const boardsById = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_BOARD': {
      const { boardId, boardTitle } = action.payload;
      return {
        ...state,
        [boardId]: {
          boardId: boardId,
          boardTitle: boardTitle,
          lists: [],
          notifications: [],
        },
      };
    }
    case 'ADD_ERROR': {
      const { boardId, errorMessage } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          errorMessage: errorMessage,
        },
      };
    }
    case 'ADD_MEMBER_CARD': {
      const { boardId, nameMember, notification, id } = action.payload;
      const notifications = state[boardId].notifications
        ? state[boardId].notifications
        : [];
      notifications.unshift({ id, [nameMember]: notification, new: true });
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          notifications: notifications,
        },
      };
    }
    case 'ADD_NOTIFICATION': {
      const { boardId, nameMember, notification, id } = action.payload;
      const objNotification = { id, [nameMember]: notification, new: true };
      const notifications = state[boardId].notifications
        ? state[boardId].notifications
        : [];
      notifications.unshift(objNotification);
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          notifications: notifications,
        },
      };
    }
    case 'READ_NOTIFICATION': {
      const { board, id } = action.payload;
      const notifications = state[board].notifications;
      notifications.forEach((element) => {
        if (element.id && element.id === id) {
          element.new = false;
        }
      });
      return {
        ...state,
        [board]: {
          ...state[board],
          notifications: notifications,
        },
      };
    }
    case 'ADD_LIST': {
      const { boardId, listId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: [...state[boardId].lists, listId],
        },
      };
    }
    case 'MOVE_LIST': {
      const { boardId, oldListIndex, newListIndex } = action.payload;
      const newLists = Array.from(state[boardId].lists);
      const [removedList] = newLists.splice(oldListIndex, 1);
      newLists.splice(newListIndex, 0, removedList);
      return { ...state, [boardId]: { ...state[boardId], lists: newLists } };
    }
    case 'DELETE_LIST': {
      const { boardId, listId } = action.payload;
      const filterDeleted = (tmpListId) => tmpListId !== listId;
      const newLists = state[boardId].lists.filter(filterDeleted);
      return { ...state, [boardId]: { ...state[boardId], lists: newLists } };
    }
    default:
      return state;
  }
};

const listsById = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_LIST': {
      const { listId, listTitle, minPercentTask } = action.payload;
      return {
        ...state,
        [listId]: { _id: listId, title: listTitle, cards: [], minPercentTask },
      };
    }
    case 'CHANGE_LIST_TITLE': {
      const { listId, listTitle, minPercentTask } = action.payload;
      return {
        ...state,
        [listId]: { ...state[listId], title: listTitle, minPercentTask },
      };
    }
    case 'DELETE_LIST': {
      const { listId } = action.payload;
      const { [listId]: deletedList, ...restOfLists } = state;
      return restOfLists;
    }
    case 'ADD_CARD': {
      const { listId, cardId } = action.payload;
      return {
        ...state,
        [listId]: { ...state[listId], cards: [...state[listId].cards, cardId] },
      };
    }
    case 'MOVE_CARD': {
      const { oldCardIndex, newCardIndex, sourceListId, destListId } =
        action.payload;
      // Move within the same list
      if (sourceListId === destListId) {
        const newCards = Array.from(state[sourceListId].cards);
        const [removedCard] = newCards.splice(oldCardIndex, 1);
        newCards.splice(newCardIndex, 0, removedCard);
        return {
          ...state,
          [sourceListId]: { ...state[sourceListId], cards: newCards },
        };
      }
      // Move card from one list to another
      const sourceCards = Array.from(state[sourceListId].cards);
      const [removedCard] = sourceCards.splice(oldCardIndex, 1);
      const destinationCards = Array.from(state[destListId].cards);
      destinationCards.splice(newCardIndex, 0, removedCard);
      return {
        ...state,
        [sourceListId]: { ...state[sourceListId], cards: sourceCards },
        [destListId]: { ...state[destListId], cards: destinationCards },
      };
    }
    case 'DELETE_CARD': {
      const { cardId: deletedCardId, listId } = action.payload;
      const filterDeleted = (cardId) => cardId !== deletedCardId;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          cards: state[listId].cards.filter(filterDeleted),
        },
      };
    }
    default:
      return state;
  }
};

const cardsById = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CARD': {
      const { cardText, cardId, ttl } = action.payload;
      const infoDeadline = {
        dangerDeadline: 2,
        warningDeadline: 4,
      };
      return {
        ...state,
        [cardId]: {
          text: cardText,
          _id: cardId,
          status: 0,
          ttl,
          member: [],
          infoDeadline,
          comments: [],
          tasks: [],
          finishTask: 0,
        },
      };
    }
    case 'ADD_TASK': {
      const { cardId, content, idTask } = action.payload;
      const tasks = state[cardId].tasks ? state[cardId].tasks : [];
      tasks.unshift({ isFinished: false, content, id: idTask });
      return { ...state, [cardId]: { ...state[cardId], tasks: tasks } };
    }
    case 'FINISH_TASK': {
      const { cardId, idTask } = action.payload;
      const tasks = state[cardId].tasks;
      const index = tasks.findIndex((task) => task.id === idTask);
      tasks[index].isFinished = true;
      const finishTask = state[cardId].finishTask
        ? state[cardId].finishTask + 1
        : 1;
      return {
        ...state,
        [cardId]: { ...state[cardId], tasks: tasks, finishTask },
      };
    }
    case 'UNFINISHED_TASK': {
      const { cardId, idTask } = action.payload;
      const tasks = state[cardId].tasks;
      const index = tasks.findIndex((task) => task.id === idTask);
      tasks[index].isFinished = false;
      const finishTask = state[cardId].finishTask - 1;
      return {
        ...state,
        [cardId]: { ...state[cardId], tasks: tasks, finishTask },
      };
    }
    case 'ADD_COMMENT': {
      const { nameUser, cardId, content, idComment } = action.payload;
      const comments = state[cardId].comments ? state[cardId].comments : [];
      comments.unshift({ nameUser, content, id: idComment });
      return { ...state, [cardId]: { ...state[cardId], comments } };
    }
    case 'CHANGE_CARD_TEXT': {
      const { cardText, cardId, ttl } = action.payload;
      return { ...state, [cardId]: { ...state[cardId], text: cardText, ttl } };
    }
    case 'CHANGE_CARD_TTL': {
      const { cardId, ttl } = action.payload;
      return { ...state, [cardId]: { ...state[cardId], ttl } };
    }
    case 'CHANGE_DEADLINE': {
      const { cardId, day, type } = action.payload;
      const infoDeadline = state[cardId].infoDeadline
        ? state[cardId].infoDeadline
        : {};
      if (type === 'danger') {
        infoDeadline.dangerDeadline = day;
      } else {
        infoDeadline.warningDeadline = day;
      }
      return { ...state, [cardId]: { ...state[cardId], infoDeadline } };
    }
    case 'DELETE_CARD': {
      const { cardId } = action.payload;
      const { [cardId]: deletedCard, ...restOfCards } = state;
      return restOfCards;
    }
    case 'ADD_MEMBER_CARD': {
      const { cardId, nameMember } = action.payload;
      const member = state[cardId].member ? state[cardId].member : [];
      member.push(nameMember);
      return {
        ...state,
        [cardId]: { ...state[cardId], member: member },
      };
    }
    // Find every card from the deleted list and remove it
    case 'DELETE_LIST': {
      const { cards: cardIds } = action.payload;
      return Object.keys(state)
        .filter((cardId) => !cardIds.includes(cardId))
        .reduce(
          (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
          {}
        );
    }
    case 'CHANGE_STATUS': {
      const { cardId } = action.payload;
      console.log(cardId);
      let status = state[cardId].status !== null ? state[cardId].status : 0;
      console.log(status);
      if (status === 2) {
        status = 0;
      } else {
        status += 1;
      }
      return {
        ...state,
        [cardId]: { ...state[cardId], status: status },
      };
    }
    default:
      return state;
  }
};

const reducers = combineReducers({
  user,
  usersById,
  boardsById,
  listsById,
  cardsById,
});

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();
const store = createStore(reducers, persistedState);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

console.log(store.getState());
if (store.getState().user.lists.length === 0) {
  console.log('SEED');
  seed(store);
}

export default store;
