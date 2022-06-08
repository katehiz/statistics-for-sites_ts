// помогает тайпскрипту опознать модули .css, и импортировать их в .ts файлах
declare module '*.module.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export default classNames;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export = content;
}