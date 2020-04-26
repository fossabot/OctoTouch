<template>
    <v-app style="background-color: #2d3436;">
        <transition name="slide-x-transition" mode="out-in">
            <router-view />
            <notifications group="foo" />
        </transition>
    </v-app>
</template>

<style lang="sass">
@import "styles.scss"
</style>

<script>
export default {
    name: "App",
    mounted: function() {
        this.$notify({
  group: 'foo',
  title: 'Important message',
  text: 'Hello user! This is a notification!'
});
    }
}
</script>
