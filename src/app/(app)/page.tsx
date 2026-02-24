import { redirect } from "next/navigation";

/** Главная страница — «Все соревнования» */
export default function AppHome() {
  redirect("/competitions");
}
