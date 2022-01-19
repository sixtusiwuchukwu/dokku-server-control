// export default BaseInterface

enum emailTemplates {

}
interface emailTemplateInterface {
  welcome?:string,
  activation?: string
  invoice?: string
  resetPassword?:string
}
export {
  emailTemplateInterface,
  emailTemplates
}
