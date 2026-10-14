import axios from "axios"

// Browser: relative "/api/" -> next.config.mjs rewrites -> Render backend
//          (isse jwt cookie nestro-ecom.vercel.app ki banegi)
// Server (SSR / server components): full backend URL, kyunki server me relative URL nahi chalta
const baseURL =
    typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "/api/";

const client = axios.create({
    baseURL,
    timeout: 60000,
    withCredentials: true,
});


const generateSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

}


export { client, generateSlug }