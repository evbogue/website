import { bogbot } from 'https://esm.sh/gh/evbogue/bog5@1fd476c/bogbot.js'
import { marked } from 'https://esm.sh/gh/evbogue/bog5@de70376265/lib/marked.esm.js'

Deno.serve(async r => {
  const latest = await fetch('https://evmicro.deno.dev/').then(j => j.json())

  const yaml = await bogbot.parseYaml(latest.text) 

  const html = `
<html>
  <head>
    <title>${yaml.name} | ${yaml.body.substring(0, 15)}...</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name='viewport' content='width=device-width initial-scale=1' />
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
    <style>
      body { margin-left: auto; margin-right: auto; width: 680px; background: #f5f5f5; font-family: "Source Sans 3", sans-serif; } 
      @media only screen and (max-width: 680px) {
        body { width: 90%; margin-left: 1em; margin-right: 1em; max-width: 100%; }
      }
 
      a {color: #0088cc; text-decoration: none;}
      img { border-radius: 15px;}
      hr { border: 1px solid #e4e4e4; width: 100%;}
    </style>
    <script type="module">
    import { bogbot } from 'https://esm.sh/gh/evbogue/bog5@1fd476c/bogbot.js'

    await bogbot.start('wiredovedbversion1')

    const ws = new WebSocket('wss://pub.wiredove.net/')

    const img = await bogbot.get('${yaml.image}')

    if (img) {
      const el = document.getElementById('${yaml.image}')
      el.src = img 
    }

    ws.onopen = async () => {
      if (!img) {
        ws.send('${yaml.image}')
      }
    }

    ws.onmessage = async (m) => {
      await bogbot.make(m.data)
      const hash = await bogbot.hash(m.data)
      if (hash === '${yaml.image}') {
        const img = document.getElementById(hash)
        img.src = m.data
      }
    }
    </script>
  </head>
        
  <body>
  <div><a href="https://wiredove.net/#${latest.sig}" style="float: right">${await bogbot.human(latest.ts)}</a><img id=${yaml.image} style='float: left; width: 75px; height: 75px; object-fit: cover; margin-right: 1em;' /> <a href="https://wiredove.net/#${latest.author}">${yaml.name}</a></div>
  <div>${marked(yaml.body)}</div>
  <div><a href="https://wiredove.net/#${latest.sig}" style="float: right">More on Wiredove &#8594;</a></div>
  <hr>
  <h1>Everett Bogue</h1>
  <p>Chicago, Illinois. I'm an isomorphic JavaScript developer focused on distributed social networking systems. Also a professional kayaker.</p>
  <p>&#128231; <a href="mailto:ev@evbogue.com">ev@evbogue.com</a></p>
  <p>&#128241; <a href="tel:773-510-8601">773-510-8601</a></p>
  <p>&#128330; <a href="https://wiredove.net/#ev">ev</a></p>
  <p>&#129419; <a href="https://bsky.app/profile/evbogue.com">evbogue.com</a></p>
  <p><img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" style="width: 25px; height: 25px; margin: 0; margin-left: -5px; vertical-align: middle;" /> <a href="https://github.com/evbogue">evbogue</a></p>
  <p><img src="https://www.linkedin.com/favicon.ico" style="width: 21px; height: 21px; margin: 0; margin-right: 5px; margin-left: -3px; vertical-align: middle;" /><a href="https://linkedin.com/in/evbogue/">evbogue</a>
  <hr>
  <p style='color: #555; font-size: .8em; font-weight: bold;'>&#169; Copyright 2025 Everett Bogue</p>
  </body>
</html>
  `

  return new Response(html, {headers: {"Content-Type": "text/html"}})
})
