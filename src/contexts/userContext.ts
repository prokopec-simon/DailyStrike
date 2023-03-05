import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export const useBalance = () => {
  // Retrieve the current user's session using Next Auth
  const session = useSession();

  const { data: predictionInfo, isLoading: IsLoadingPrediction } =
    trpc.user.getUserData.useQuery(session.data?.user?.id ?? "");

    const predictionMutation = trpc.user.updateUserBalance.useMutation();

    const t = async (newBalacnce: number) => {
      predictionMutation.mutate({ userId: session.data?.user?.id ?? "", balanceChange: 1 })
    {
      onSuccess: (context:any) => {
        // Call refetch to trigger a refetch of the balance query and update the balance in the website's state
        context.queryClient.refetchQueries(["balance", session.data?.user?.id]);
      },
    }

  // Return the user's balance and loading state
  return {
    predictionInfo,
    isLoading: session.status == "loading",
    updateBalanceMutation,
  };
};
