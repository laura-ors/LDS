import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const rawTitle = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  
  // Split on " | " or just "|" – we'll trim spaces
  const parts = rawTitle.split("|").map(part => part.trim())
  
return (
  <h2 class={classNames(displayClass, "page-title")} >
    <a href={baseDir}>
      Learning<br />Data Science
    </a>
  </h2>
)
}

PageTitle.css = `
.epistemic-note {
    font-size: 0.8em;
    color: var(--gray);
    padding-top: 0.5rem;
    border-top: 1px dashed var(--lightgray);
}


@font-face {
    font-family: 'Old Soviet';
    src: url('/static/fonts/TT2020Base-Regular.woff2') format('woff2'),
         url('/static/fonts/TT2020Base-Regular.woff') format('woff'),
         url('/static/fonts/TT2020Base-Regular.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 400;
}
@font-face {
    font-family: 'Old Soviet';
    src: url('/static/fonts/TT2020StyleE-Regular.woff2') format('woff2'),
         url('/static/fonts/TT2020StyleE-Regular.woff') format('woff'),
         url('/static/fonts/TT2020StyleE-Regular.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 700;
}
    
@font-face {
    font-family: 'KJV1611';
    src: url('/static/fonts/KJV1611.woff2') format('woff2'),
         url('/static/fonts/KJV1611.woff') format('woff'),
         url('/static/fonts/KJV1611.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 700;
}

@font-face {
    font-family: 'KJV1611';
    src: url('/static/fonts/KJV1611.woff2') format('woff2'),
         url('/static/fonts/KJV1611.woff') format('woff'),
         url('/static/fonts/KJV1611.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 400;
}


@font-face {
    font-family: 'Coelacanth';
    src: url('/static/fonts/Coelacanth.woff2') format('woff2'),
         url('/static/fonts/Coelacanth.woff') format('woff'),
         url('/static/fonts/Coelacanth.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 400;
}

@font-face {
    font-family: 'Coelacanth';
    src: url('/static/fonts/Coelacanth.woff2') format('woff2'),
         url('/static/fonts/Coelacanth.woff') format('woff'),
         url('/static/fonts/Coelacanth.ttf') format('truetype');
    font-style: normal;
    font-display: swap;
    font-weight: 700;
}

.page-title {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  font-family: 'KJV1611' !important;
}
  .page-title {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    font-family: 'KJV1611' !important;
}

/* 🟢 ADD THIS BLOCK 🟢 */
.page-title a {
    white-space: normal !important;
    display: inline-block !important;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
