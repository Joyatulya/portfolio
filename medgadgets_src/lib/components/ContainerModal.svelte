<script>
	import Icon from "$lib/icons/Icon.svelte";
  export let animate = false
  let ID = Math.round((Math.random() * 100_000_000)).toString()
  ID = 'my_modal_' + ID;
</script>
<!-- Open the modal using ID.showModal() method -->
<div class="inline-block cursor-pointer" class:animate-pulse={animate} onclick={`${ID}.showModal()`}>
  <slot name="icon">
    <Icon name='tooltip' width=24/>
  </slot>
</div>
<dialog id={ID} class="modal modal-bottom sm:modal-middle text-base-content">
  <form method="dialog" class="modal-box">
    <h3 class="text-lg font-bold">
      <slot name="heading"><!-- optional fallback --></slot>
    </h3>
    <div class="">
      <slot name="content"><!-- optional fallback --></slot>
    </div>
    <slot />
    <div class="modal-action">
      <!-- if there is a button in form, it will close the modal -->
      <button class="btn btn-primary">Close</button>
    </div>
  </form>
</dialog>

<style>

  div{
    white-space: normal;
    word-break: keep-all;
    
  }
</style>