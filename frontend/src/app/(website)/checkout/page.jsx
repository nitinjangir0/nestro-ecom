import Checkout from "@/components/website/Checkout";
import { getProfile } from "@/utils/serverapi";

export default async function Page() {
    const user = await getProfile();

    return <Checkout user={user.data} />;
}