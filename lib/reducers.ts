type ActionMap<M extends { [index: string]: User | User[] | { id: number } }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key } : { type: Key; payload: M[Key] };
};

export enum ActionTypes {
  Create = 'CREATE',
  Add = 'ADD',
  Delete = 'DELETE',
}

export type User = {
  id: number;
  name: string;
  email: string;
};

type UserFormPayload = {
  [ActionTypes.Create]: User[];
  [ActionTypes.Add]: User;
  [ActionTypes.Delete]: {
    id: number;
  };
};

export type UserFormActions = ActionMap<UserFormPayload>[keyof ActionMap<UserFormPayload>];
export const userFormReducer = (state: User[], action: UserFormActions): User[] => {
  switch (action.type) {
    case ActionTypes.Create:
      return action.payload;
    case ActionTypes.Add:
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        },
      ];
    case ActionTypes.Delete:
      return [
        ...state
          .filter((user) => user.id !== action.payload.id)
          .map((user, index) => {
            return {
              ...user,
              id: index + 1,
            };
          }),
      ];
    default:
      return state;
  }
};
