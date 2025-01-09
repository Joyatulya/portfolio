<script lang="ts">
  export let width : number = 32;
  export let height : number = 32;
  let library = {
    'drop' : `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="currentColor" d="M5.636 6.633L12 .269l6.364 6.364a9 9 0 1 1-12.728 0ZM12 3.097l-4.95 4.95A6.978 6.978 0 0 0 5 12.997h14a6.978 6.978 0 0 0-2.05-4.95L12 3.097Z"/></svg>`,
    'timer' : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m17.618 5.968l1.453-1.453l1.414 1.414l-1.453 1.453A9 9 0 1 1 12 4c2.125 0 4.078.736 5.618 1.968ZM12 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14ZM11 8h2v6h-2V8ZM8 1h8v2H8V1Z"/></svg>',
    'syringe' : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m21.678 7.98l-1.414 1.413l-2.122-2.121l-2.121 2.121l3.536 3.536l-1.415 1.414l-.707-.707L11.071 20H5.414l-2.12 2.121l-1.415-1.414L4 18.586v-5.657l6.364-6.364l-.707-.707l1.414-1.414l3.536 3.535l2.121-2.121l-2.121-2.122l1.414-1.414l5.657 5.657Zm-5.657 4.242l-4.243-4.243l-1.414 1.414l2.121 2.122l-1.414 1.414l-2.121-2.122l-1.414 1.415l2.121 2.121l-1.414 1.414l-2.121-2.121l-.122.121V18h4.243l5.778-5.778Z"/></svg>',
    'rate' : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M20 13c0 2.21-.895 4.21-2.343 5.657l1.414 1.414A9.97 9.97 0 0 0 22 13c0-5.523-4.477-10-10-10S2 7.477 2 13a9.969 9.969 0 0 0 2.929 7.071l1.414-1.414A8 8 0 1 1 20 13Zm-4.707-4.707L10.5 12.5l2 2l4.207-4.793l-1.414-1.414Z"/></svg>',
    'tooltip' : `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM11 7h2v2h-2V7Zm0 4h2v6h-2v-6Z"/></svg>`
  }
  export let name: keyof typeof library

  let icon = name ? library[name] : ''
</script>

  {@html icon}


