import { getCurrentUser, getIsLoading } from "../../../context/Userdetails";
import { Navigate } from "@solidjs/router";
import { Show, type ParentComponent } from "solid-js";

interface AuthRedirectProps {
  redirectTo?: string;
}
const AuthRedirect: ParentComponent<AuthRedirectProps> = (props) => {
  return (
    <Show
      when={!getIsLoading()}
      fallback={
        <div class='flex items-center justify-center min-h-screen'>
          <div class='text-lg'>Loading...</div>
        </div>
      }>
      <Show
        when={!getCurrentUser()}
        fallback={<Navigate href={props.redirectTo || "/"} />}>
        {props.children}
      </Show>
    </Show>
  );
};

export default AuthRedirect;
