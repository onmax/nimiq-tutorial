<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import type { WidgetInstance } from '../types/feedback-widget'

const widgetContainer = ref<HTMLDivElement>()
const isWidgetLoaded = ref(false)
const widgetInstance = ref<WidgetInstance>()
const showFallbackForm = ref(false)

let cssLink: HTMLLinkElement
let script: HTMLScriptElement

const FEEDBACK_DOMAIN = __FEEDBACK_DOMAIN__

const open = ref(false)

// Step 1: Load CSS with preload and fallback
function loadWidgetCss() {
  if (document.getElementById('nimiq-feedback-css')) return
  cssLink = document.createElement('link')
  cssLink.id = 'nimiq-feedback-css'
  cssLink.rel = 'preload'
  cssLink.href = `${FEEDBACK_DOMAIN}/widget.css`
  cssLink.as = 'style'
  cssLink.crossOrigin = 'anonymous'
  cssLink.onload = () => {
    cssLink.onload = null
    cssLink.rel = 'stylesheet'
  }
  cssLink.onerror = () => {
    const fallback = document.createElement('link')
    fallback.rel = 'stylesheet'
    fallback.href = `${FEEDBACK_DOMAIN}/widget.css`
    fallback.crossOrigin = 'anonymous'
    document.head.appendChild(fallback)
  }
  document.head.appendChild(cssLink)
}

// Step 2: Load JS with defer
function loadWidgetScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window.mountFeedbackWidget === 'function') return resolve()
    if (document.getElementById('nimiq-feedback-js')) return resolve()
    script = document.createElement('script')
    script.id = 'nimiq-feedback-js'
    script.src = `${FEEDBACK_DOMAIN}/widget.js`
    script.crossOrigin = 'anonymous'
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load feedback widget script'))
    document.head.appendChild(script)
  })
}

// Step 3: Mount the widget after scripts are loaded
async function mountWidget() {
  await nextTick()
  if (!widgetContainer.value) return
  try {
    widgetInstance.value = window.mountFeedbackWidget('#feedback-widget', {
      app: 'nimiq-tutorial',
      lang: 'en',
      feedbackEndpoint: `${FEEDBACK_DOMAIN}/api/feedback`,
      dev: import.meta.env.DEV,
      dark: document.documentElement.getAttribute('data-theme') === 'dark',
    })
    widgetInstance.value.communication?.on('form-selected', (formType) => {
      console.log('Form selected:', formType)
    })
    widgetInstance.value.communication?.on('form-submitted', (data) => {
      console.log('Feedback submitted successfully:', data)
      setTimeout(() => { open.value = false }, 2000)
    })
    widgetInstance.value.communication?.on('form-error', (error) => {
      console.error('Feedback submission error:', error)
    })
    widgetInstance.value.communication?.on('before-submit', ({ formData, type, app }) => {
      formData.append('debugInfo', JSON.stringify({ userAgent: navigator.userAgent, url: window.location.href, timestamp: new Date().toISOString() }))
    })
    setTimeout(() => {
      widgetInstance.value?.showFormGrid()
    }, 100)
  } catch (error) {
    console.error('Failed to initialize feedback widget:', error)
    showFallbackForm.value = true
  }
}

function cleanupWidget() {
  if (widgetInstance.value) {
    try { widgetInstance.value.destroy() } catch {}
    widgetInstance.value = undefined
  }
}

function retryWidgetLoad() {
  showFallbackForm.value = false
  loadWidgetCss()
  loadWidgetScript()
    .then(() => isWidgetLoaded.value = true)
    .catch(() => {
      isWidgetLoaded.value = false
      showFallbackForm.value = true
    })
}

watch(open, async (newValue) => {
  if (newValue) {
    showFallbackForm.value = false
    loadWidgetCss()
    try {
      await loadWidgetScript()
      isWidgetLoaded.value = true
    } catch {
      isWidgetLoaded.value = false
      showFallbackForm.value = true
    }
  } else {
    cleanupWidget()
    showFallbackForm.value = false
    isWidgetLoaded.value = false
  }
}, { immediate: false })

watch([isWidgetLoaded, open], async ([loaded, modalOpen]) => {
  if (loaded && modalOpen) await mountWidget()
})

onUnmounted(() => {
  cleanupWidget()
  if (typeof cssLink !== 'undefined' && document.head.contains(cssLink)) document.head.removeChild(cssLink)
  if (typeof script !== 'undefined' && document.head.contains(script)) document.head.removeChild(script)
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-bind="$attrs">
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay class="fixed inset-0 z-50 bg-black/15 backdrop-blur-sm" />
      </Transition>
      <Transition name="modal">
        <DialogContent
          class="fixed bottom-0 left-0 right-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 rounded-t-2xl lg:rounded-2xl z-50 h-max max-h-[85vh] w-full transform overflow-y-auto outline-none shadow-lg lg:max-w-[500px] modal-container"
          @open-auto-focus.prevent
        >
          <div class="relative bg-white dark:bg-neutral-900 py-8 ring-1 ring-neutral-200 dark:ring-neutral-800">
            <DialogTitle class="mb-3 px-6 text-center text-neutral-900 dark:text-neutral font-bold text-2xl leading-none lg:px-10" as="h2">
              Share Your Feedback
            </DialogTitle>
            
            <DialogDescription class="block px-6 text-center text-neutral-700 dark:text-neutral-400 lg:px-10">
              Help us improve the Nimiq Tutorial by sharing your thoughts, reporting bugs, or suggesting new tutorials.
            </DialogDescription>

            <div class="mt-3 px-6 lg:px-10">
              <!-- Loading state -->
              <div v-if="!isWidgetLoaded && !showFallbackForm" class="flex items-center justify-center h-64">
                <div class="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
                  <div class="i-nimiq:spinner w-5 h-5" />
                  <span>Loading feedback form...</span>
                </div>
              </div>
              
              <!-- External Widget -->
              <div
                id="feedback-widget"
                ref="widgetContainer"
                :class="{ block: isWidgetLoaded, hidden: !isWidgetLoaded }"
              />
              
              <!-- Error state -->
              <div v-if="showFallbackForm && !isWidgetLoaded" class="flex items-center justify-center h-64">
                <div class="text-center space-y-4">
                  <div class="i-nimiq:warning w-12 h-12 text-yellow-500 mx-auto" />
                  <div class="text-neutral-500 dark:text-neutral-400">
                    Unable to load feedback form
                  </div>
                  <div class="text-sm text-neutral-400 dark:text-neutral-500">
                    Please try again later or contact us directly in <a href="https://t.me/Nimiq" target="_blank" class="text-blue-600 hover:text-blue-700 underline">Telegram</a>
                  </div>
                  <button 
                    @click="retryWidgetLoad"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>

            <DialogClose 
              class="absolute right-4 top-4 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              aria-label="Close"
            >
              <div class="i-nimiq:cross w-6 h-6" />
            </DialogClose>
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Based on crypto-map Modal.vue transitions */

.backdrop-enter-active {
  transition: opacity 650ms cubic-bezier(0.3, 1, 0.2, 1);
}

.backdrop-leave-active {
  transition: opacity 650ms cubic-bezier(0.3, 0, 0, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 1023px) {
  .modal-enter-active,
  .modal-leave-active {
    transition: transform 200ms ease-out;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(100%);
  }
}

@media (min-width: 1024px) {
  .modal-enter-active,
  .modal-leave-active {
    transition:
      opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 0.5rem)) scale(0.96);
  }
}

/* Use CSS variables from theme */
.modal-container {
  background-color: var(--tk-background-primary);
  color: var(--tk-text-primary);
  border-color: var(--tk-border-primary);
}

/* lg breakpoint */
@media (min-width: 1024px) {
  .lg\:rounded-2xl {
    border-radius: 1rem;
  }
  
  .lg\:max-w-\[500px\] {
    max-width: 500px;
  }
  
  .lg\:px-10 {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
</style>
