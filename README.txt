RESUME MAKER
============
A simple website that builds a resume from your details and photo,
then saves it as a PDF. Made with HTML, CSS and JavaScript only.

HOW TO OPEN
-----------
1. Unzip this folder.
2. Double-click index.html (Chrome, Edge, Firefox or Safari).
   No server, no installation, no internet needed
   (the fonts need internet, otherwise Georgia/Arial are used).

FOLDER STRUCTURE
----------------
index.html      The page: navigation, home section, how it works, resume builder, footer.
css/style.css   All the design: colours, layout, mobile view, print (PDF) rules.
js/script.js    All the logic: live preview, photo upload, colours, save, PDF.

HOW TO USE
----------
1. Fill in your details on the left.
2. Click "Upload photo" to add your picture (JPG or PNG).
3. Click "Generate Resume". Your resume is created in the preview on the right.
4. Pick a colour with the round buttons above the preview (it changes at once).
5. Click "Download PDF", then choose "Save as PDF" as the destination.
   In Chrome, open "More settings" and turn on "Background graphics"
   so the coloured sidebar is included.

If you change something after generating, the preview tells you to click
"Generate Resume" again to update it.

Other buttons: "Load sample" fills an example, "Clear all" empties everything.
Your details are saved in your own browser only. Nothing is uploaded anywhere.

HOW IT WORKS (for your presentation)
------------------------------------
HTML       Builds the structure: the form, the preview area and the sections.
CSS        Makes it look good, adjusts to phone screens, and formats the A4 page for PDF.
JavaScript Reads your details, builds the resume when you click Generate, crops your photo
           into a square, and saves your data in the browser (localStorage).

TO CHANGE THINGS
----------------
- Site colours:      css/style.css, top of the file (:root).
- Resume colours:    js/script.js, the "colors" list.
- Sample resume:     js/script.js, "sampleData" at the top.
