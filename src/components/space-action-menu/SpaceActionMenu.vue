<template>
  <div class="space-action-menu" v-click-away="closeMenu">
    <BIMDataButton color="default" ghost rounded icon
      class="space-action-menu__btn"
      @click="toggleMenu">
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
    <transition name="fade">
      <div class="space-action-menu__container" v-show="isOpen">
        <transition name="fade" mode="out-in">
          <div class="action-menu" v-if="!onUpdate">
            <BIMDataButton ghost squared
              @click="openUpdate">
              {{ $t('Spaces.SpaceActionMenu.rename') }}
            </BIMDataButton>
            <BIMDataButton ghost squared>
              {{ $t('Spaces.SpaceActionMenu.changeImage') }}
            </BIMDataButton>
            <BIMDataButton ghost squared>
              {{ $t('Spaces.SpaceActionMenu.deleteImage') }}
            </BIMDataButton>
            <BIMDataButton ghost squared
              @click="deleteSpace(space)">
              {{ $t('Spaces.SpaceActionMenu.delete') }}
            </BIMDataButton>
          </div>
          <div class="update-form" v-else>
            <span class="update-form__title">
              {{ $t('Spaces.SpaceRenameForm.title') }}
            </span>
            <BIMDataButton ghost rounded icon
              class="update-form__cancel-btn"
              @click="closeUpdate">
              <BIMDataIcon name="close" size="xxxs" />
            </BIMDataButton>
            <BIMDataInput ref="nameInput"
              class="update-form__input"
              :placeholder="$t('Spaces.SpaceRenameForm.inputName')"
              v-model="spaceName"
            />
            <BIMDataButton fill radius color="primary"
              class="update-form__submit-btn"
              @click="renameSpace">
              {{ $t('Spaces.SpaceRenameForm.buttonRename') }}
            </BIMDataButton>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataInput from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { deleteSpace, updateSpace } = useSpacesState();

    const nameInput = ref(null);
    const isOpen = ref(false);
    const onUpdate = ref(false);
    const spaceName = ref(props.space.name);

    const closeMenu = () => { isOpen.value = false; closeUpdate(); };
    const toggleMenu = () => { isOpen.value = !isOpen.value; closeUpdate(); };
    const openUpdate = () => { onUpdate.value = true; setTimeout(() => nameInput.value.focus(), 400); };
    const closeUpdate = () => onUpdate.value = false;
    const renameSpace = () => updateSpace({ ...props.space, name: spaceName.value }).then(closeMenu);

    return {
      nameInput,
      isOpen,
      onUpdate,
      spaceName,
      closeMenu,
      toggleMenu,
      openUpdate,
      closeUpdate,
      renameSpace,
      deleteSpace,
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceActionMenu.scss"></style>
