/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Pressable,
  Linking
} from 'react-native';

import WindowsAIApisModule from './src/NativeWindowsAIApisModule';

function App(): React.JSX.Element {
  
  const [prompt, setPrompt] = useState('Tell me a fun fact about space.');
  const [response, setResponse] = useState('');
  const [generateHover, setGenerateHover] = useState(false);
  const [generatePressed, setGeneratePressed] = useState(false);
  const [apiSourceExpanded, setApiSourceExpanded] = useState(false);
  const [documentationHyperlinkHover, setdocumentationHyperlinkHover] = useState(false);
  const [viewCodeHover, setViewCodeHover] = useState(false);
  const [viewCodePressed, setViewCodePressed] = useState(false);

  const backgroundStyle = {
    backgroundColor: '#f9f9f9',
    padding: 5,
    paddingLeft: 25,
    paddingRight: 10,
    width: '100%',
    height: '100%',
  };

  const apiSource = `using Microsoft.Windows.AI;
using Microsoft.Windows.AI.Text;

var readyState = LanguageModel.GetReadyState();
if (readyState is AIFeatureReadyState.Ready or AIFeatureReadyState.NotReady)
{
    if (readyState == AIFeatureReadyState.NotReady)
    {
        var op = await LanguageModel.EnsureReadyAsync();
    }

    using LanguageModel languageModel = await LanguageModel.CreateAsync();

    string prompt = "Tell me a short story";

    var result = languageModel.GenerateResponseAsync(prompt);

    result.Progress += (sender, args) =>
    {
        Console.Write(args);
    };

    await result;
}`;

const phiSilicaDocumentation = `Phi Silica is a local language model that you can integrate into your Windows apps using Windows AI Foundry.

As Microsoft's most powerful NPU-tuned local language model, Phi Silica is optimized for efficiency and performance on Windows Copilot+ PCs devices while still offering many of the capabilities found in Large Language Models (LLMs).`

  return (
    <View style={backgroundStyle}>
      <View style={styles.header}>
        <Image source={require('./assets/WCRAPI.png')} style={styles.headerIcon}/>
        <Text allowFontScaling style={styles.headerTitle}>Phi Silica Text Generation</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.generateTextView}>
          <View style={styles.generateTextHeaderView}>
            <TextInput allowFontScaling style={styles.generateTextInput} value={prompt} onChangeText={(text)=>setPrompt(text)} />
          <Pressable style={[styles.generateButton, generateHover? {backgroundColor: windowsColors.accentColorHover} : {}, generatePressed? {borderColor: windowsColors.accentColor} : {}]} onPress={()=>WindowsAIApisModule?.getPhiSilicaResponse(prompt).then(result => setResponse(result))} onHoverIn={()=>setGenerateHover(true)} onHoverOut={()=>setGenerateHover(false)} onPressIn={()=>setGeneratePressed(true)} onPressOut={()=>setGeneratePressed(false)}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </Pressable>
          </View>
          <View style={styles.generateTextBoxView}>
            <Text style={styles.generateTextBoxText}>{response}</Text>
          </View>
          <Text allowFontScaling style={styles.generateTextDisclaimer}>AI-generated content might be incorrect, offensive, or biased.</Text>
        </View>
        <View style={styles.apiView}>
          <View style={styles.apiViewHeader}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiHeaderIcon}>&#xE943;</Text>
              <Text style={styles.apiHeaderText}>API</Text>
            </View>
          </View>
          <ScrollView horizontal style={[styles.apiSourceView, !apiSourceExpanded? {height: 200} : {}]}>
            <Text allowFontScaling style={styles.apiSourceText}>{apiSource}</Text>
          </ScrollView>
          {!apiSourceExpanded && <Pressable style={[viewCodeHover? styles.viewCodeButton : {}, viewCodePressed ? {opacity: 0.5} : {}]} onPress={()=>setApiSourceExpanded(true)} onHoverIn={()=>setViewCodeHover(true)} onHoverOut={()=>setViewCodeHover(false)} onPressIn={()=>{setViewCodePressed(true)}} onPressOut={()=>setViewCodePressed(false)}>
            <Text style={styles.viewCodeButtonText}>View code</Text>
          </Pressable>}
        </View>
        <View style={styles.apiView}>
          <View style={styles.apiViewHeader}>
            <View style={styles.apiHeader}>
              <Text allowFontScaling style={styles.apiHeaderIcon}>&#xE160;</Text>
              <Text allowFontScaling style={styles.apiHeaderText}>Documentation</Text>
            </View>
            <Pressable onHoverIn={()=>setdocumentationHyperlinkHover(true)} onHoverOut={()=>{setdocumentationHyperlinkHover(false)}} style={[styles.documentationHyperlinkButton, documentationHyperlinkHover? styles.documentationHyperlinkButtonHover : {}]} onPress={()=>Linking.openURL('https://github.com/MicrosoftDocs/windows-ai-docs/blob/docs/docs/apis/phi-silica.md')}>
              <Text allowFontScaling style={styles.documentationHyperlinkText}>View documentation</Text>
              <Text allowFontScaling style={styles.documentationHyperlinkIcon}>&#xE8A7;</Text>
            </Pressable>
          </View>
          <View style={styles.documentationSourceView}>
            <Text allowFontScaling>{phiSilicaDocumentation}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const text = {
  fontFamily: 'Segoe UI'
}

const windowsColors = {
  appBackground: '#f9f9f9',
  blueGradient: '#f2f7ff',
  borderLight: '#dcdcdc',
  accentColor: '#0067c0',
  accentColorHover: '#1975c6',
  accentText: 'white',
  ultraLightText: '#909193',
  lightText: '#5d5e61',
  hyperlink: '#003e92',
  hyperlinkHighlight: '#f4f4f4',
  white: 'white'
}

const STANDARD_MARGIN = 15;

const styles = StyleSheet.create({
  scroll: {
    paddingRight: 15
  },
  header: {
    marginTop: 25,
    marginRight: STANDARD_MARGIN,
    marginBottom: STANDARD_MARGIN,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 15,
    ...text
  },
  headerIcon: {
    alignSelf: 'flex-end'
  },
  generateTextView: {
    backgroundColor: windowsColors.blueGradient, // should be gradient
    borderColor: windowsColors.borderLight,
    borderWidth: 1,
    height: 300,
    borderRadius: 10,
    padding: STANDARD_MARGIN,
    marginBottom: 15,
  },
  generateTextHeaderView: {
    flexDirection: 'row',
    marginBottom: STANDARD_MARGIN
  },
  generateTextInput: {
    borderColor: windowsColors.borderLight,
    borderWidth: 1,
    width: '100%',
    marginRight: STANDARD_MARGIN,
    flex: 1,
    backgroundColor: windowsColors.accentText,
    padding: 5,
    height: 30
  },
  generateButton: {
    backgroundColor: windowsColors.accentColor,
    borderBottomWidth: 1,
    height: 32, 
    width: 85,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  generateButtonText: {
    color: windowsColors.accentText,
    ...text
  },
  generateTextBoxView: {
    marginBottom: STANDARD_MARGIN,
    flex: 1
  },
  generateTextBoxText: {
    fontSize: 15,
    color: windowsColors.lightText,
    marginTop: STANDARD_MARGIN,
    ...text
  },
  generateTextDisclaimer: {
    fontSize: 10,
    color: windowsColors.ultraLightText,
    ...text
  },
  apiView: {
    backgroundColor: windowsColors.white,
    borderColor: windowsColors.borderLight,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15
  },
  apiViewHeader: {
    borderColor: windowsColors.borderLight,
    borderBottomWidth: 1,
    height: 50,
    padding: STANDARD_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  apiHeader: {
    flexDirection: 'row'
  },
  apiHeaderText: {
    fontWeight: '500'
  },
  apiHeaderIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    color: windowsColors.hyperlink,
    marginRight: 7,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '400'
  },
  apiSourceView: {
    padding: STANDARD_MARGIN
  },
  apiSourceText: {
    fontFamily: 'Cascadia Code',
    fontSize: 14
  },
  viewCodeButton: {
    backgroundColor: windowsColors.appBackground,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  viewCodeButtonText: {
    alignSelf: 'center',
    padding: STANDARD_MARGIN,
  },
  documentationSourceView: {
    padding: STANDARD_MARGIN,
    height: 150
  },
  documentationHyperlinkButtonHover: {
    backgroundColor: windowsColors.hyperlinkHighlight,
    borderRadius: 3,
  },
  documentationHyperlinkButton: {
    flexDirection: 'row'
  },
  documentationHyperlinkText: {
    color: windowsColors.hyperlink
  },
  documentationHyperlinkIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    color: windowsColors.hyperlink,
    alignSelf: 'center',
    marginLeft: 7
  },
  test: {
    color: 'black'
  }
});

export default App;
