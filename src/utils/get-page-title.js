import defaultSettings from '@/settings'

const title = defaultSettings.title || '摄像机设置系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
