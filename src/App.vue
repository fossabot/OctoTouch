<template>
    <v-app style="background-color: #2d3436;">
        <transition name="slide-x-transition" mode="out-in">
            <router-view />
        </transition>
    </v-app>
</template>

<style lang="sass">
@import "styles.scss"
</style>

<script>
export default {
    name: "App",
}
</script>
