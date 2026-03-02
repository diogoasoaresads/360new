import { redirect } from "next/navigation";

export default function AppHomePage() {
  // Redireciona para a página de seleção de organização
  redirect("/orgs");
}
