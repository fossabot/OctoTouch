<style lang="sass">
  @import "QuickAdjust.scss"
</style>

<template>
        <div @click.self="closeModal" class="modal-container">
          <div class="modal-wrapper">
            <v-row>
              <v-col v-ripple @click="bedOffset(1)" justify=center align=center style="color: #fff; font-size: 6vh; font-weight: 300;">+1</v-col>
              <v-col></v-col>
              <v-col v-ripple @click="bedOffset(10)" justify=center align=center style="color: #fff; font-size: 6vh; font-weight: 300;">+10</v-col>
            </v-row>
            <v-row style="margin-top: 0px; margin-bottom: 0px;">
              <v-col></v-col>
              <v-col justify=center align=center style="color: #fff; font-size: 12vh; font-weight: 300;">{{value}}</v-col>
              <v-col></v-col>
            </v-row>
            <v-row style="border-bottom: 4px solid #fff;">
              <v-col v-ripple @click="bedOffset(-1)" justify=center align=center style="color: #fff; font-size: 6vh; font-weight: 300;">-1</v-col>
              <v-col></v-col>
              <v-col v-ripple @click="bedOffset(-10)" justify=center align=center style="color: #fff; font-size: 6vh; font-weight: 300;">-10</v-col>
            </v-row>
            <v-row>
              <v-col></v-col>
              <v-col v-ripple @click.self="closeModal" justify=center align=center style="color: #fff; font-size: 6vh; font-weight: 300;">back</v-col>
              <v-col></v-col>
            </v-row>
          </div>
        </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: "QuickAdjust",
    mounted: function() {
        
    },
    methods: {
        closeModal: function() {
            this.$emit("close")
        }
    },
    computed: {

    },
    props: {
        value: Number
    },
    data: function() {
        return {
        }
    }
})
</script>
