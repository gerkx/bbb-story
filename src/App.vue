<template>
  <v-app>
    

    <v-main>
      <Import />
    </v-main>
  </v-app>
</template>

<script>
import Import from './views/Import';

export default {
  name: 'App',

  components: {
    Import,
  },

  data: () => ({
    //
  }),
};
</script>
