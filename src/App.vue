<template>
  <v-app>
    <v-app-bar
      app
      color="grey-darken3"
      dense
      dark
    >
      <v-tabs v-model="tabs" color="white">
        <v-tab key="import" to="/import">Import</v-tab>
        <v-tab key="supers" to="/supers">Supers</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn icon @click="reload">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import Import from './views/Import';

export default {
  name: 'App',

  components: {
    // Import,
  },

  mounted() {
    // eslint-disable-next-line no-undef
    this.csInterface = new CSInterface();
    this.loadJSX('json.jsx');
    this.loadJSX('extendscript.jsx');
    this.$router.push('supers')
  },

  data: () => ({
    csInterface: null,
    tab: null,
    pages: [
      {tab: "beep", content: "boop"},
      {tab: "herp", content: "derp"},
    ]
  }),
  methods: {
    reload() { location.reload(); },
    loadJSX(filename) {
        // eslint-disable-next-line no-undef
        this.csInterface.evalScript(`$.evalFile('${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/jsx/${filename}')`);
    },
  }
};
</script>
