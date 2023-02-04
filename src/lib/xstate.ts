import { createMachine, assign } from "xstate";

export const redditMachine = createMachine<
  {
    subreddit: null | string;
    posts: null | Record<string, any>[];
  },
  { type: "SELECT"; name: string }
>({
  id: "reddit",
  initial: "idle",
  context: {
    subreddit: null,
    posts: null,
  },
  states: {
    idle: {},
    selected: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "fetch-subreddit",
            src: (context) => {
              return fetch(`https://www.reddit.com/r/${context.subreddit}.json`)
                .then((res) => res.json())
                .then((json) =>
                  json.data.children.map((child: any) => child.data)
                );
            },
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data,
              }),
            },
            onError: "failed",
          },
        },
        loaded: {},
        failed: {},
      },
    },
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign({
        subreddit: (context, event) => event.name,
      }),
    },
  },
});
