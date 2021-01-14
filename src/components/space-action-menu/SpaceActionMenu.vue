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
            <BIMDataButton ghost squared
              @click="selectSpaceImage">
              {{ $t('Spaces.SpaceActionMenu.changeImage') }}
              <input hidden ref="fileInput" type="file"
                @change="uploadSpaceImage"
              />
            </BIMDataButton>
            <BIMDataButton ghost squared
              @click="removeSpaceImage">
              {{ $t('Spaces.SpaceActionMenu.removeImage') }}
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
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { ref } from 'vue';
import { useGlobalState } from '@/state/globalState';
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
    const { user } = useGlobalState();
    const { deleteSpace, updateSpace, softUpdateSpace } = useSpacesState();

    const nameInput = ref(null);
    const fileInput = ref(null);
    const isOpen = ref(false);
    const onUpdate = ref(false);
    const spaceName = ref(props.space.name);

    const uppy = new Uppy({
      id: `space-image-${props.space.id}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: null
      }
    });
    uppy.use(XHRUpload, {
      method: 'patch',
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${props.space.id}`,
      fieldName: 'image',
      metaFields: [],
      headers: {
        'Authorization': `Bearer ${user.value.access_token}`
      }
    });
    uppy.on('upload-error', (file, error) => {
      // TODO: properly handle error
      console.log('An error occurred while uploading file: ' + file.name);
      console.error(error);
    });
    uppy.on('complete', ({ successful:[{ response:{ body:{ image }}}] }) => {
      softUpdateSpace({ ...props.space, image });
      fileInput.value.value = ""; // reset file input
      uppy.reset(); // reset Uppy instance
      closeMenu();
    });

    const closeMenu = () => { isOpen.value = false; closeUpdate(); };
    const toggleMenu = () => { isOpen.value = !isOpen.value; closeUpdate(); };
    const openUpdate = () => { onUpdate.value = true; setTimeout(() => nameInput.value.focus(), 400); };
    const closeUpdate = () => onUpdate.value = false;

    const renameSpace = () => updateSpace({ ...props.space, name: spaceName.value }).then(closeMenu);
    const selectSpaceImage = () => fileInput.value.click();
    const uploadSpaceImage = ({ target: { files: [ file ] } }) => {
      if (file) {
        uppy.addFile({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file
        });
      }
    };
    const removeSpaceImage = () => {
      updateSpace({ ...props.space, image: null }).then(closeMenu);
    };

    return {
      // References
      nameInput,
      fileInput,
      isOpen,
      onUpdate,
      spaceName,
      // Methods
      closeMenu,
      toggleMenu,
      openUpdate,
      closeUpdate,
      renameSpace,
      selectSpaceImage,
      uploadSpaceImage,
      removeSpaceImage,
      deleteSpace,
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceActionMenu.scss"></style>
