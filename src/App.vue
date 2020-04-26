<template>
    <v-app style="background-color: #2d3436;">
        <transition name="slide-x-transition" mode="out-in">
            <router-view />
        </transition>
        <notifications group="global" style="margin-right: 2vh; margin-top: 2vh;"/>
    </v-app>
</template>

<style lang="sass">
@import "styles.scss"
</style>

<script>
export default {
    name: "App"
}
</script>
