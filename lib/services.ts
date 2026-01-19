import { authClient } from "./auth-client";

export const githubLogin = async () => {
    try {
        const res = await authClient.signIn.social({
            provider: "github"
        })
        console.log(res);
        return
    } catch (e) {
        console.log(e);

    }
}
