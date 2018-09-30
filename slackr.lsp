(add-custom-zone '("slack" 0x5d))

(define colors '(
  (70 175 135)
  (70 175 135)
  (233 172 32)
  (233 172 32)
  (140 210 222)
  (140 210 222)
  (212 17 57)
  (212 17 57)
))

(define slack-flasher {
  proto*: Flasher
    period: 100
    auto-enable: #t
    zero-color: '(255 255 255)
    hundred-color: '(255 255 255)
    update-color: (lambda (c val)
      (on-device 'rgb-per-key-zones show-percent-on-zone: c val slack:)
    )
    cleanup-function: (lambda ()
      (update-color color value)
    )
})

(handler "SLACKD"
  (lambda (data)
    (let*
      (
        (keys (value: data))
      )
      (on-device "rgb-per-key-zones" show-on-keys: (reduce append '() keys) colors)
    )
  )
)

(handler "START" (lambda (data)
  (on-device "rgb-per-key-zones" show-on-zone: '(70 175 135) number-keys:)
  (on-device "rgb-per-key-zones" show-on-zone: '(233 172 32) q-row:)
  (on-device "rgb-per-key-zones" show-on-zone: '(140 210 222) a-row:)
  (on-device "rgb-per-key-zones" show-on-zone: '(212 17 57) z-row:)
  (on-device "rgb-per-key-zones" show-on-zone: '(255 255 255) slack:)
  (send slack-flasher set-value: 80)
))

(handler "STOP" (lambda (data)
  (send Generic-Initializer deinitialize:)
))

(add-event-per-key-zone-use "SLACKD" "all")