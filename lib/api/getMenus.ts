

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getMenus = async () =>{
    const res = await fetch(`${BASE_URL}/menus`)
    return res.json();
}