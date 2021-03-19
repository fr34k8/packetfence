import { computed, toRefs } from '@vue/composition-api'
import i18n from '@/utils/locale'
import {
  defaultsFromMeta as useItemDefaults
} from '../../_config/'

const useItemTitle = (props) => {
  const {
    id,
    isClone,
    isNew
  } = toRefs(props)
  return computed(() => {
    switch (true) {
      case !isNew.value && !isClone.value:
        return i18n.t('Security Event <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Security Event <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Security Event')
    }
  })
}

const useRouter = (props, context, form) => {
  const {
    id
  } = toRefs(props)
  const { root: { $router } = {} } = context
  return {
    goToCollection: () => $router.push({ name: 'security_events' }),
    goToItem: () => $router.push({ name: 'security_event', params: { id: form.value.id || id.value } })
      .catch(e => { if (e.name !== "NavigationDuplicated") throw e }),
    goToClone: () => $router.push({ name: 'cloneSecurityEvent', params: { id: id.value } }),
  }
}

const useStore = (props, context, form) => {
  const {
    id,
    isClone
  } = toRefs(props)
  const { root: { $store } = {} } = context
  return {
    isLoading: computed(() => $store.getters['$_security_events/isLoading']),
    getOptions: () => $store.dispatch('$_security_events/options'),
    createItem: () => $store.dispatch('$_security_events/createSecurityEvent', form.value),
    deleteItem: () => $store.dispatch('$_security_events/deleteSecurityEvent', id.value),
    getItem: () => $store.dispatch('$_security_events/getSecurityEvent', id.value).then(item => {
      if (isClone.value) {
        item.id = `${item.id}-${i18n.t('copy')}`
        item.not_deletable = false
      }
      return item
    }),
    updateItem: () => $store.dispatch('$_security_events/updateSecurityEvent', form.value),
  }
}

export default {
  useItemDefaults,
  useItemTitle,
  useRouter,
  useStore,
}
