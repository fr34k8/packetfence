import store from '@/store'
import i18n from '@/utils/locale'
import yup from '@/utils/yup'

yup.addMethod(yup.string, 'sourceIdNotExistsExcept', function (exceptId = '', message) {
  return this.test({
    name: 'sourceIdNotExistsExcept',
    message: message || i18n.t('Source exists.'),
    test: (value) => {
      if (!value || value.toLowerCase() === exceptId.toLowerCase()) return true
      return store.dispatch('config/getSources').then(response => {
        return response.filter(source => source.id.toLowerCase() === value.toLowerCase()).length === 0
      }).catch(() => {
        return true
      })
    }
  })
})

export const schemaRule = yup.object({
  status: yup.string(),
  id: yup.string().meta({ fieldName: i18n.t('Name') }),
  description: yup.string(),
  match: yup.string(),
  actions: yup.array().meta({ fieldName: i18n.t('Action') }),
  conditions: yup.array().meta({ fieldName: i18n.t('Condition') })
})

export const schemaRules = yup.array().of(schemaRule)

export const schema = (props) => {
  const {
    id,
    isNew,
    isClone
  } = props

  return yup.object({
    id: yup.string()
      .nullable()
      .required(i18n.t('Name required.'))
      .sourceIdNotExistsExcept((!isNew && !isClone) ? id : undefined, i18n.t('Name exists.')),

    administration_rules: schemaRules,
    authentication_rules: schemaRules,

  })
}

export default schema
