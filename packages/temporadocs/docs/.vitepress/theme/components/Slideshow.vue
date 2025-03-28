<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";

const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
});

const currentIndex = ref(0);
const isLightboxOpen = ref(false);
const currentImage = computed(() => props.images[currentIndex.value]);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const openLightbox = () => {
  isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="slideshow-wrapper">
    <div class="carousel-container">
      <div class="carousel">
        <img :src="currentImage" class="carousel-image" @click="openLightbox" />
      </div>
    </div>
    <div class="carousel-navigation">
      <button class="prev" @click="prevSlide" v-if="props.images.length >= 2">‹</button>
      <div class="dots-container" v-if="props.images.length > 1">
        <span v-for="(image, index) in props.images" :key="index" class="dot" :class="{ active: index === currentIndex }" @click="goToSlide(index)"></span>
      </div>
      <button class="next" @click="nextSlide" v-if="props.images.length >= 2">›</button>
    </div>
  </div>

  <div v-if="isLightboxOpen" class="lightbox" @click.self="closeLightbox">
    <img :src="currentImage" class="lightbox-image" />
  </div>
</template>

<style scoped>
.slideshow-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  box-sizing: border-box;
  width: auto;
}

.carousel-navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 12px;
}

.carousel-container {
  display: flex;
  align-items: center;
  width: auto;
  overflow: hidden;
  justify-content: center;
  max-height: 640px;
}

.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 640px;
}

.carousel-image {
  object-fit: contain;
  height: auto;
  border-radius: 12px;
  cursor: zoom-in;
}

.prev,
.next {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 5px;
  height: 64px;
  user-select: none;
}

.prev:hover,
.next:hover {
  background: rgba(255, 255, 255, 0.1);
}

.prev:active,
.next:active {
  scale: 0.9;
}

.dots-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.2s;
}

.dot.active {
  width: 16px;
  height: 16px;
  background-color: white;
  transform: scale(1.2);
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.lightbox-image {
  max-width: 100%;
  min-height: 600px;
  max-height: 600px;
  border-radius: 12px;
}
</style>
