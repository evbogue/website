import { bogbot } from 'https://esm.sh/gh/evbogue/bog5@1fd476c/bogbot.js'
import { marked } from 'https://esm.sh/gh/evbogue/bog5@de70376265/lib/marked.esm.js'

Deno.serve(async r => {
  const latest = await fetch('https://evmicro.deno.dev/').then(j => j.json())

  const yaml = await bogbot.parseYaml(latest.text) 

  const html = `
<html>
  <head>
    <title>${yaml.name} | ${yaml.body.substring(0, 15)}...</title>
    <style>body { margin-left: auto; margin-right: auto; width: 680px; max-width: 100%; background: #f5f5f5; font-family: sans-serif; } 
      a {color: #666; text-decoration: none;}
      img { border-radius: 15px;}
      hr { border: 1px solid #e4e4e4; width: 100%;}
    </style>
    <script type="module">
    import { bogbot } from 'https://esm.sh/gh/evbogue/bog5@1fd476c/bogbot.js'

    const ws = new WebSocket('ws://146.190.37.114:9000')

    ws.onopen = () => {
      ws.send('${yaml.image}')
    }

    ws.onmessage = async (m) => {
      const hash = await bogbot.hash(m.data)
      console.log(m.data)
      if (hash === '${yaml.image}') {
        const img = document.getElementById(hash)
        img.src = m.data
      }
    }
    </script>
  </head>
        
  <body>
  <h1>The Latest</h1>
  <div><a href="https://wiredove.net/#${latest.sig}" style="float: right">${await bogbot.human(latest.ts)}</a><img id=${yaml.image} style='float: left; width: 75px; height: 75px; object-fit: cover; margin-right: 1em;' /> <a href="https://wiredove.net/${latest.author}">${yaml.name}</a></div>
  <div>${marked(yaml.body)}</div>
  <div><a href="https://wiredove.net/#${latest.sig}" style="float: right">More on Wiredove &#8594;</a></div>
  <hr>
  <h1>Everett Bogue</h1>
  <p>&#128231; <a href="mailto:ev@evbogue.com">ev@evbogue.com</a></p>
  <p>&#128241; <a href="tel:773-510-8601">773-510-8601</a></p>
  <p>&#128330; <a href="https://wiredove.net/#ev">ev</a></p>
  <p>&#129419; <a href="https://bsky.app/profile/evbogue.com">evbogue.com</a></p>
  <p><img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" style="width: 25px; height: 25px; margin: 0; margin-left: -5px; vertical-align: middle;" /> <a href="https://github.com/evbogue">evbogue</a></p>
  </body>
</html>
  `

  return new Response(html, {headers: {"Content-Type": "text/html"}})
})
