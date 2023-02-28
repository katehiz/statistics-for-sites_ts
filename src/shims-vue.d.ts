// помогает тайпскрипту опознать модули .vue., и импортировать их в .ts файлах
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
