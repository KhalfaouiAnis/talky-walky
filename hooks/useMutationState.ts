import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";
import { useState } from "react";

export const useMutationState = (
  mutationToRun: FunctionReference<"mutation">
) => {
  const [pending, setPending] = useState(false);
  const mutationFn = useMutation(mutationToRun);

  //   eslint-disable-next-line
  const mudtate = (payload: any) => {
    setPending(true);
    
    return mutationFn(payload)
      .then((res) => res)
      .catch((err) => {
        throw err;
      })
      .finally(() => setPending(false));
  };

  return { mudtate, pending };
};
