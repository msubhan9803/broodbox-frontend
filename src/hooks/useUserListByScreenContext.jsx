/* eslint-disable react-hooks/rules-of-hooks */
import { useAllUsers } from "hooks/useUser";
import { useAllUsersByFarmId } from "hooks/useFarmManagement";
import { userManagementComponentContextTypes } from 'utils/constants'

export default function useUserListByScreenContext({ context, farmId, ...rest }) {
  if (context === userManagementComponentContextTypes.farm_detail) {
    return useAllUsersByFarmId({ farmId, ...rest });
  } else {
    return useAllUsers({ ...rest });
  }
}
