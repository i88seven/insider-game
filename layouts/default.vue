<template>
  <v-app dark>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="true" app>
      <span>&copy; {{ new Date().getFullYear() }} i88seven</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {};
</script>
