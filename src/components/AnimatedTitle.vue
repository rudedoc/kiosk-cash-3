<template>
  <div>
    <h1 ref="animatedTitleRef" class="text-7xl font-semibold">
      <span v-for="(letter, index) in titleLetters" :key="index" class="title-letter">
        {{ letter }}
      </span>
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';

const title = 'Welcome To Kiosk Cash';
const titleLetters = ref(title.split(''));
const animatedTitleRef = ref(null);

onMounted(async () => {
  await nextTick();

  const letterElements = animatedTitleRef.value.querySelectorAll('.title-letter');

  if (letterElements.length === 0) {
    console.error('No letter elements found. Check your template.');
    return;
  }

  // You can set initial invisible state here if you want them to be hidden before JS runs.
  // GSAP's fromTo will handle making them visible.
  gsap.set(letterElements, { opacity: 0 }); // Ensures they start hidden

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
  });

  // 1. Letters enter one by one from right to left
  tl.fromTo(
    letterElements,
    {
      // FROM VARS (starting state of this tween)
      x: 50, // Start 50px to the right
      opacity: 0, // Start transparent
    },
    {
      // TO VARS (ending state of this tween)
      x: 0, // End at natural horizontal position
      opacity: 1, // End fully visible
      duration: 0.4,
      ease: 'power2.out',
      stagger: {
        each: 0.1,
        from: 'start',
      },
    },
  );

  // 2. Once all entered, all letters slide down and disappear
  tl.to(letterElements, {
    y: 60,
    opacity: 0, // Fade out
    duration: 0.6,
    ease: 'power2.in',
    delay: 0.5, // Pause after entry
  });
});
</script>

<style scoped>
.title-letter {
  display: inline-block;
  min-width: 10px; /* Give it some space */
  position: relative; /* Good for transforms */
}
</style>
