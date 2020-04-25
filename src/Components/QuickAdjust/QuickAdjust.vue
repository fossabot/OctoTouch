<style lang="sass">
  @import "QuickAdjust.scss"
</style>

<template>
        <div @click.self="closeModal" class="quickadjust__modal-container">
          <div class="quickadjust__modal-wrapper">
            <v-row>
              <v-col v-ripple @click="inc(1)" justify=center align=center class="quickadjust__action">+1</v-col>
              <v-col></v-col>
              <v-col v-ripple @click="inc(10)" justify=center align=center class="quickadjust__action">+10</v-col>
            </v-row>
            <v-row style="margin-top: 0px; margin-bottom: 0px;">
              <v-col></v-col>
              <v-col justify=center align=center style="color: #fff; font-size: 12vh; font-weight: 300;">{{setPoint}}</v-col>
              <v-col></v-col>
            </v-row>
            <v-row style="border-bottom: 4px solid #fff;">
              <v-col v-ripple @click="dec(1)" justify=center align=center class="quickadjust__action">-1</v-col>
              <v-col v-if="value == 0"></v-col>
              <v-col v-if="value != 0" v-ripple @click="setPoint=0" justify=center align=center class="quickadjust__action">off</v-col>
              <v-col v-ripple @click="dec(10)" justify=center align=center class="quickadjust__action">-10</v-col>
            </v-row>
            <v-row>
              <v-col></v-col>
              <v-col v-ripple @click.self="setValue();closeModal()" justify=center align=center class="quickadjust__set">set</v-col>
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
        this.setPoint = this.value
    },
    methods: {
        closeModal: function() {
            this.$emit("close")
        },
        setValue: function() {
            this.$emit("setValue", this.setPoint)
        },
        dec: function(value) {
            if(this.setPoint - value >= 0) {
                this.setPoint = this.setPoint - value
            }
        },
        inc: function(value) {
            if(this.setPoint + value >= 0) {
                this.setPoint = this.setPoint + value
            }
        }
    },
    computed: {

    },
    props: {
        value: Number
    },
    data: function() {
        return {
            setPoint: 0
        }
    }
})
</script>
