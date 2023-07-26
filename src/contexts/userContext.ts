import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export function useUserDetail() {
  const { data: sessionData } = useSession();
  const userQuery = trpc.user.getUserData.useQuery(
    sessionData?.user?.id ?? "",
    { enabled: sessionData?.user !== undefined }
  );
  const utils = trpc.useContext();
  const placePredictionMutation = trpc.user.placePrediction.useMutation({
    onSuccess() {
      utils.user.invalidate();
    },
  });

  return [userQuery, placePredictionMutation] as const;
}
