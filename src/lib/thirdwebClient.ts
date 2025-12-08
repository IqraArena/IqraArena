import { createThirdwebClient } from 'thirdweb';
import { THIRDWEB_CLIENT_ID } from '../contracts/contractConfig';

export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});
