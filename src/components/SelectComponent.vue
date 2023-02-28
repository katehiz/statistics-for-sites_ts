<template>
    <select :value="value" @input="selectOption($event.target.value)" v-show="list.length">
        <option v-for="item in list" :key="item" :value="item">
            {{item}}
        </option>
    </select>
</template>

<script lang="ts">
    // import Vue from 'vue';
    import { Vue, Component, Prop } from 'vue-property-decorator';

    const SelectComponentExtend = Vue.extend({
        name: 'SelectComponent',
        props: {
            list: {
                type: Array,
                default: () => ([])
            },
            value: String
        }
    });

    @Component({})
    export default class SelectComponent extends SelectComponentExtend {
        selectedOption:string = this.$props.value
        selectOption (value:string): void {
            this.$emit('input', value)
        }
    }
</script>