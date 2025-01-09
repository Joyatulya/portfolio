<script lang="ts">
	import type { PageLoad } from "../../routes/$types";

  export let data : PageLoad
  let { supabase, session } = data
  $: ({ supabase } = data)

  let email
  let password
  const handleSignUp = async () => {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
  }
  
  const handleSignIn = async () => {
    if (session){
      return
    }
    const {data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
</script>

<form on:submit="{handleSignUp}">
  <input name="email" bind:value="{email}" />
  <input type="password" name="password" bind:value="{password}" />
  <button>Sign up</button>
</form>

<button on:click="{handleSignIn}">Sign in</button>
<button on:click="{handleSignOut}">Sign out</button>