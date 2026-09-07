import React, {useEffect, useMemo, useState} from 'react';
import {Alert, FlatList, Image, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, DarkTheme as NavDark, DefaultTheme as NavLight} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';

const imgs = [
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=900',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900'
];

const base = [
 ['বিরিয়ানি','Biryani','বাংলাদেশ','মাংস',50,'মাঝারি',['বাসমতি চাল ২ কাপ','মুরগি ৭০০ গ্রাম','পেঁয়াজ ৩টি','দই ১ কাপ','মসলা ২ টেবিল চামচ'],'মাংসে দই ও মসলা মাখিয়ে ৩০ মিনিট রাখুন। পেঁয়াজ ভেজে মাংস রান্না করুন। চাল ৭০% সেদ্ধ করে মাংসের ওপর দিন। ঢেকে ২০ মিনিট দমে রান্না করুন।'],
 ['ইলিশ ভাজা','Fried Hilsa','বাংলাদেশ','মাছ',25,'সহজ',['ইলিশ ৪ টুকরা','হলুদ ১ চা চামচ','লবণ স্বাদমতো','সরিষার তেল ৪ টেবিল চামচ'],'মাছে হলুদ ও লবণ মাখিয়ে ১০ মিনিট রাখুন। গরম তেলে দুই পাশ সোনালি করে ভেজে নিন।'],
 ['ভুনা খিচুড়ি','Bhuna Khichuri','বাংলাদেশ','ভাত',45,'মাঝারি',['চাল ১ কাপ','মসুর ডাল ১ কাপ','পেঁয়াজ ২টি','আদা-রসুন ১ টেবিল চামচ','মসলা ১ টেবিল চামচ'],'চাল ও ডাল ধুয়ে নিন। তেলে পেঁয়াজ ও মসলা ভেজে চাল-ডাল দিন। পানি দিয়ে ঢেকে নরম হওয়া পর্যন্ত রান্না করুন।'],
 ['চিকেন কারি','Chicken Curry','ভারত','মাংস',40,'সহজ',['মুরগি ৬০০ গ্রাম','পেঁয়াজ ২টি','টমেটো ২টি','দই আধা কাপ','গরম মসলা ১ চা চামচ'],'পেঁয়াজ ভাজুন। টমেটো ও মসলা দিয়ে কষান। মুরগি দিয়ে ভালোভাবে কষিয়ে পানি দিন এবং ঢেকে রান্না করুন।'],
 ['বাটার চিকেন','Butter Chicken','ভারত','মাংস',45,'মাঝারি',['চিকেন ৬০০ গ্রাম','মাখন ৫০ গ্রাম','টমেটো পিউরি ১ কাপ','ক্রিম আধা কাপ','মসলা ১ টেবিল চামচ'],'চিকেন মেরিনেট করে ভেজে নিন। মাখনে টমেটো ও মসলা রান্না করে চিকেন দিন। শেষে ক্রিম মিশিয়ে ১০ মিনিট রান্না করুন।'],
 ['পনির টিক্কা','Paneer Tikka','ভারত','সবজি',30,'সহজ',['পনির ৩০০ গ্রাম','দই আধা কাপ','ক্যাপসিকাম ১টি','মসলা ১ টেবিল চামচ'],'দই ও মসলা দিয়ে পনির মাখিয়ে ১৫ মিনিট রাখুন। সবজি সহ স্কিউয়ারে দিয়ে গ্রিল বা প্যানে সেঁকে নিন।'],
 ['ফ্রাইড রাইস','Fried Rice','চীন','ভাত',25,'সহজ',['সেদ্ধ ভাত ৩ কাপ','ডিম ২টি','গাজর ১টি','সয়া সস ২ টেবিল চামচ','তেল ২ টেবিল চামচ'],'প্যানে তেল গরম করে ডিম ভাজুন। সবজি দিন। ভাত ও সয়া সস দিয়ে উচ্চ আঁচে নেড়ে ৫ মিনিট রান্না করুন।'],
 ['চাওমিন','Chow Mein','চীন','ফাস্ট ফুড',25,'সহজ',['নুডলস ৩০০ গ্রাম','মুরগি ২০০ গ্রাম','বাঁধাকপি ১ কাপ','সয়া সস ২ টেবিল চামচ'],'নুডলস সেদ্ধ করুন। মুরগি ও সবজি উচ্চ আঁচে ভাজুন। নুডলস ও সস দিয়ে দ্রুত মিশিয়ে নিন।'],
 ['স্প্রিং রোল','Spring Roll','চীন','নাস্তা',35,'মাঝারি',['র‍্যাপার ১০টি','বাঁধাকপি ২ কাপ','গাজর ১টি','মুরগি ১৫০ গ্রাম','সয়া সস ১ টেবিল চামচ'],'পুর ভেজে ঠান্ডা করুন। র‍্যাপারে পুর দিয়ে রোল করুন। গরম তেলে ক্রিসপি হওয়া পর্যন্ত ভাজুন।'],
 ['পিজ্জা মার্গারিটা','Pizza Margherita','ইতালি','ফাস্ট ফুড',35,'মাঝারি',['পিজ্জা ডো ১টি','টমেটো সস আধা কাপ','মোজারেলা ১৫০ গ্রাম','বেসিল পাতা'],'ডো পাতলা করে ছড়ান। সস ও চিজ দিন। ২২০°C ওভেনে প্রায় ১২-১৫ মিনিট বেক করুন।'],
 ['পাস্তা আরাবিয়াতা','Pasta Arrabbiata','ইতালি','সহজ রান্না',25,'সহজ',['পাস্তা ২৫০ গ্রাম','টমেটো সস ১ কাপ','রসুন ৪ কোয়া','চিলি ফ্লেক্স ১ চা চামচ'],'পাস্তা সেদ্ধ করুন। রসুন ও চিলি ভেজে টমেটো সস দিন। পাস্তা মিশিয়ে ৩ মিনিট রান্না করুন।'],
 ['লাসানিয়া','Lasagna','ইতালি','মাংস',70,'কঠিন',['লাসানিয়া শিট ৮টি','কিমা ৫০০ গ্রাম','টমেটো সস ২ কাপ','মোজারেলা ২০০ গ্রাম'],'কিমা ও সস রান্না করুন। শিট, সস ও চিজ স্তরে স্তরে সাজান। ১৮০°C তে ৩৫-৪০ মিনিট বেক করুন।'],
 ['সুশি রোল','Sushi Roll','জাপান','মাছ',50,'কঠিন',['সুশি রাইস ২ কাপ','নরি ৪ শিট','সালমন ২০০ গ্রাম','শসা ১টি'],'ভিনেগার মেশানো ভাত নরিতে ছড়ান। মাছ ও শসা দিন। শক্ত করে রোল করে টুকরা করুন।'],
 ['রামেন','Ramen','জাপান','সহজ রান্না',30,'মাঝারি',['রামেন নুডলস ২ প্যাক','চিকেন স্টক ৪ কাপ','ডিম ২টি','সবুজ পেঁয়াজ'],'স্টক ফুটিয়ে নুডলস দিন। বাটিতে নুডলস ও স্টক ঢেলে সেদ্ধ ডিম ও পেঁয়াজ দিয়ে পরিবেশন করুন।'],
 ['টেম্পুরা','Tempura','জাপান','নাস্তা',30,'মাঝারি',['চিংড়ি ৩০০ গ্রাম','ময়দা ১ কাপ','ঠান্ডা পানি ১ কাপ','তেল ভাজার জন্য'],'পাতলা ব্যাটার তৈরি করুন। চিংড়ি ব্যাটারে ডুবিয়ে গরম তেলে হালকা সোনালি করে ভাজুন।'],
 ['প্যাড থাই','Pad Thai','থাইল্যান্ড','ফাস্ট ফুড',30,'মাঝারি',['রাইস নুডলস ২৫০ গ্রাম','চিংড়ি ২০০ গ্রাম','ডিম ২টি','প্যাড থাই সস আধা কাপ'],'নুডলস ভিজিয়ে রাখুন। চিংড়ি ও ডিম ভেজে নুডলস ও সস দিন। উচ্চ আঁচে নেড়ে পরিবেশন করুন।'],
 ['গ্রিন কারি','Green Curry','থাইল্যান্ড','মাংস',40,'মাঝারি',['চিকেন ৫০০ গ্রাম','গ্রিন কারি পেস্ট ৩ টেবিল চামচ','নারকেল দুধ ৪০০ml','বেগুন ১ কাপ'],'কারি পেস্ট ভাজুন। নারকেল দুধ ও চিকেন দিন। সবজি দিয়ে ঢেকে চিকেন সেদ্ধ হওয়া পর্যন্ত রান্না করুন।'],
 ['টম ইয়াম','Tom Yum','থাইল্যান্ড','মাছ',30,'মাঝারি',['চিংড়ি ২৫০ গ্রাম','স্টক ৪ কাপ','লেমনগ্রাস ২টি','মাশরুম ১ কাপ','লেবুর রস ২ টেবিল চামচ'],'স্টকে লেমনগ্রাস ও মাশরুম ফুটান। চিংড়ি দিন। শেষে লেবুর রস ও মসলা দিয়ে নামিয়ে নিন।'],
 ['বিবিমবাপ','Bibimbap','দক্ষিণ কোরিয়া','ভাত',40,'মাঝারি',['ভাত ২ কাপ','গাজর ১টি','পালং ১ কাপ','ডিম ২টি','গোচুজাং ২ টেবিল চামচ'],'সবজি আলাদা করে ভাজুন। বাটিতে ভাত ও সবজি সাজিয়ে ডিম দিন। গোচুজাং দিয়ে মিশিয়ে খান।'],
 ['কিমচি ফ্রাইড রাইস','Kimchi Fried Rice','দক্ষিণ কোরিয়া','ভাত',25,'সহজ',['ভাত ৩ কাপ','কিমচি ১ কাপ','ডিম ২টি','সয়া সস ১ টেবিল চামচ'],'কিমচি ভাজুন। ভাত ও সয়া সস দিন। উচ্চ আঁচে নেড়ে শেষে ভাজা ডিম দিয়ে পরিবেশন করুন।'],
 ['বুলগোগি','Bulgogi','দক্ষিণ কোরিয়া','মাংস',45,'মাঝারি',['গরুর মাংস ৫০০ গ্রাম','সয়া সস আধা কাপ','চিনি ১ টেবিল চামচ','রসুন ১ টেবিল চামচ'],'পাতলা মাংস সয়া সস, চিনি ও রসুনে ৩০ মিনিট মেরিনেট করুন। গরম প্যানে দ্রুত ভেজে নিন।']
];

const moreNames = [
 ['আলু ভর্তা','Potato Bhorta','বাংলাদেশ','সবজি'],['ডাল তড়কা','Dal Tadka','ভারত','ডাল'],['গার্লিক নান','Garlic Naan','ভারত','নাস্তা'],
 ['ম্যানচুরিয়ান','Manchurian','চীন','ফাস্ট ফুড'],['ডাম্পলিং','Dumplings','চীন','নাস্তা'],['রিসোটো','Risotto','ইতালি','ভাত'],
 ['তিরামিসু','Tiramisu','ইতালি','ডেজার্ট'],['জাপানি কারি','Japanese Curry','জাপান','মাংস'],['ম্যাচা কেক','Matcha Cake','জাপান','কেক'],
 ['ম্যাংগো স্টিকি রাইস','Mango Sticky Rice','থাইল্যান্ড','মিষ্টি'],['প্যাড ক্ৰাপাও','Pad Kra Pao','থাইল্যান্ড','মাংস'],['কিমচি প্যানকেক','Kimchi Pancake','দক্ষিণ কোরিয়া','নাস্তা'],
 ['টেটোকবোক্কি','Tteokbokki','দক্ষিণ কোরিয়া','ফাস্ট ফুড'],['রসগোল্লা','Rasgulla','বাংলাদেশ','মিষ্টি'],['ফুচকা','Fuchka','বাংলাদেশ','ফাস্ট ফুড'],
 ['চিকেন সমুচা','Chicken Samosa','ভারত','নাস্তা'],['মালাই কোফতা','Malai Kofta','ভারত','মাংস'],['এগ ফ্রাইড রাইস','Egg Fried Rice','চীন','ভাত'],
 ['চিজ পাস্তা','Cheese Pasta','ইতালি','সহজ রান্না'],['গার্লিক ব্রেড','Garlic Bread','ইতালি','নাস্তা'],['ওনিগিরি','Onigiri','জাপান','ভাত'],
 ['চিকেন কাতসু','Chicken Katsu','জাপান','মাংস'],['গ্রিন টি','Green Tea','জাপান','পানীয়'],['থাই আইসড টি','Thai Iced Tea','থাইল্যান্ড','পানীয়'],
 ['কোকোনাট স্যুপ','Coconut Soup','থাইল্যান্ড','সবজি'],['কোরিয়ান ফ্রাইড চিকেন','Korean Fried Chicken','দক্ষিণ কোরিয়া','মাংস'],['হটটক','Hotteok','দক্ষিণ কোরিয়া','মিষ্টি'],
 ['চকলেট কেক','Chocolate Cake','বাংলাদেশ','কেক'],['আমের শরবত','Mango Drink','বাংলাদেশ','পানীয়']
];

const recipes = [...base.map((r,i)=>({id:String(i+1),name:r[0],en:r[1],country:r[2],category:r[3],time:r[4],difficulty:r[5],ingredients:r[6],steps:r[7],image:imgs[i%imgs.length],servings:4,tips:'পরিবেশনের আগে স্বাদ দেখে লবণ-মসলা সামঞ্জস্য করুন।'})),
 ...moreNames.map((r,i)=>({id:String(base.length+i+1),name:r[0],en:r[1],country:r[2],category:r[3],time:20+(i%5)*5,difficulty:i%3===0?'সহজ':i%3===1?'মাঝারি':'কঠিন',ingredients:['প্রধান উপকরণ ১টি','প্রধান উপকরণ ২ কাপ','লবণ স্বাদমতো','মসলা ১ চা চামচ'],steps:'সব উপকরণ প্রস্তুত করুন। মসলা ও প্রধান উপকরণ একসাথে রান্না করুন। ভালোভাবে সিদ্ধ/ভাজা হলে পরিবেশন করুন।',image:imgs[(i+2)%imgs.length],servings:4,tips:'তাজা উপকরণ ব্যবহার করলে স্বাদ আরও ভালো হবে।'}))];

const cats=['সব','ভাত','মাছ','মাংস','সবজি','ডাল','নাস্তা','ফাস্ট ফুড','মিষ্টি','ডেজার্ট','পানীয়','কেক','সহজ রান্না'];
const countries=['সব','বাংলাদেশ','ভারত','চীন','ইতালি','জাপান','থাইল্যান্ড','দক্ষিণ কোরিয়া'];

function Card({item,onPress,fav,onFav,dark}) {
 return <Pressable onPress={onPress} style={[styles.card,{backgroundColor:dark?'#1d1d1d':'#fff'}]}>
   <Image source={{uri:item.image}} style={styles.cardImg}/>
   <View style={styles.cardBody}><View style={{flex:1}}><Text style={[styles.cardTitle,{color:dark?'#fff':'#222'}]}>{item.name}</Text><Text style={styles.muted}>{item.country} • {item.time} মিনিট</Text></View>
   <Pressable onPress={onFav}><Ionicons name={fav?'heart':'heart-outline'} size={25} color={fav?'#e53935':dark?'#ddd':'#555'}/></Pressable></View>
 </Pressable>
}

function Home({navigation,favorites,toggle,dark,setTab}) {
 const featured=recipes.slice(0,6);
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}>
 <ScrollView contentContainerStyle={styles.pad}>
  <View style={styles.header}><View><Text style={[styles.brand,{color:dark?'#fff':'#222'}]}>রান্নাঘর 🍲</Text><Text style={styles.muted}>আজ কী রান্না করবেন?</Text></View><Pressable onPress={()=>setTab('Profile')}><Ionicons name="person-circle-outline" size={38} color={dark?'#fff':'#222'}/></Pressable></View>
  <Pressable style={styles.searchBox} onPress={()=>setTab('Search')}><Ionicons name="search" size={21} color="#777"/><Text style={{color:'#777',marginLeft:8}}>রেসিপি খুঁজুন...</Text></Pressable>
  <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>🍽️ আজকের রেসিপি</Text>
  <Pressable onPress={()=>navigation.navigate('Details',{item:recipes[0]})}><Image source={{uri:recipes[0].image}} style={styles.hero}/><View style={styles.heroText}><Text style={styles.heroTitle}>{recipes[0].name}</Text><Text style={{color:'#fff'}}>সহজ • {recipes[0].time} মিনিট</Text></View></Pressable>
  <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>🔥 জনপ্রিয় রেসিপি</Text>
  <FlatList horizontal showsHorizontalScrollIndicator={false} data={featured} keyExtractor={x=>x.id} renderItem={({item})=><View style={{width:240,marginRight:12}}><Card item={item} dark={dark} fav={favorites.includes(item.id)} onFav={()=>toggle(item.id)} onPress={()=>navigation.navigate('Details',{item})}/></View>}/>
  <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>📂 ক্যাটাগরি</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>{cats.slice(1).map(c=><Pressable key={c} onPress={()=>setTab('Search')} style={styles.chip}><Text>{c}</Text></Pressable>)}</ScrollView>
  <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>🌍 দেশভিত্তিক রেসিপি</Text>
  <View style={styles.countryGrid}>{countries.slice(1).map(c=><Pressable key={c} style={styles.country} onPress={()=>navigation.navigate('Country',{country:c})}><Text style={{fontSize:24}}>🌍</Text><Text style={{marginTop:5,fontWeight:'700'}}>{c}</Text></Pressable>)}</View>
 </ScrollView></SafeAreaView>
}

function Search({navigation,favorites,toggle,dark}) {
 const [q,setQ]=useState(''); const [cat,setCat]=useState('সব'); const [country,setCountry]=useState('সব');
 const data=useMemo(()=>recipes.filter(r=>(!q||[r.name,r.en,...r.ingredients].join(' ').toLowerCase().includes(q.toLowerCase()))&&(cat==='সব'||r.category===cat)&&(country==='সব'||r.country===country)),[q,cat,country]);
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.pad}>
  <Text style={[styles.title,{color:dark?'#fff':'#222'}]}>রেসিপি খুঁজুন 🔍</Text>
  <View style={styles.searchBox}><Ionicons name="search" size={21} color="#777"/><TextInput value={q} onChangeText={setQ} placeholder="রেসিপি বা উপকরণ লিখুন..." placeholderTextColor="#888" style={{flex:1,marginLeft:8,color:dark?'#fff':'#222'}}/></View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>{cats.map(c=><Pressable key={c} onPress={()=>setCat(c)} style={[styles.chip,cat===c&&styles.activeChip]}><Text>{c}</Text></Pressable>)}</ScrollView>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>{countries.map(c=><Pressable key={c} onPress={()=>setCountry(c)} style={[styles.chip,country===c&&styles.activeChip]}><Text>{c}</Text></Pressable>)}</ScrollView>
  <Text style={[styles.muted,{marginBottom:8}]}>{data.length}টি রেসিপি পাওয়া গেছে</Text>
  <FlatList data={data} keyExtractor={x=>x.id} renderItem={({item})=><Card item={item} dark={dark} fav={favorites.includes(item.id)} onFav={()=>toggle(item.id)} onPress={()=>navigation.navigate('Details',{item})}/>} showsVerticalScrollIndicator={false}/>
 </View></SafeAreaView>
}

function Favorites({navigation,favorites,toggle,dark}) {
 const data=recipes.filter(r=>favorites.includes(r.id));
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.pad}><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>❤️ আমার পছন্দ</Text>
 {data.length?<FlatList data={data} keyExtractor={x=>x.id} renderItem={({item})=><Card item={item} dark={dark} fav onFav={()=>toggle(item.id)} onPress={()=>navigation.navigate('Details',{item})}/>} />:<View style={styles.empty}><Text style={{fontSize:50}}>❤️</Text><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>এখনো কোনো পছন্দের রেসিপি নেই</Text><Text style={styles.muted}>রেসিপির পাশে ❤️ চাপলে এখানে দেখা যাবে</Text></View>}
 </View></SafeAreaView>
}

function Countries({navigation,dark}) {
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.pad}><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>🌍 দেশের রেসিপি</Text><View style={styles.countryGrid}>{countries.slice(1).map(c=><Pressable key={c} style={styles.country} onPress={()=>navigation.navigate('Country',{country:c})}><Text style={{fontSize:30}}>🍛</Text><Text style={{fontWeight:'700',marginTop:8}}>{c}</Text><Text style={styles.muted}>{recipes.filter(r=>r.country===c).length} রেসিপি</Text></Pressable>)}</View></View></SafeAreaView>
}

function Profile({dark,setDark}) {
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.pad}><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>👤 প্রোফাইল</Text><View style={[styles.setting,{backgroundColor:dark?'#1d1d1d':'#fff'}]}><Text style={{fontSize:17,color:dark?'#fff':'#222'}}>🌙 ডার্ক মোড</Text><Switch value={dark} onValueChange={setDark}/></View><View style={styles.about}><Text style={{fontSize:22,fontWeight:'800'}}>রান্নাঘর 🍲</Text><Text style={styles.muted}>আপনার প্রতিদিনের রান্নার সঙ্গী</Text><Text style={styles.muted}>মোট রেসিপি: {recipes.length}</Text></View></View></SafeAreaView>
}

function Details({route,navigation,favorites,toggle,dark}) {
 const item=route.params.item; const fav=favorites.includes(item.id);
 const copy=()=>Alert.alert('কপি করা হয়েছে','উপকরণগুলো কপি করার সুবিধাটি Android clipboard integration-এর জন্য প্রস্তুত।');
 const share=async()=>{try{await Share.share({message:`${item.name}\\n${item.country}\\n\\nউপকরণ:\\n${item.ingredients.join('\\n')}\\n\\nপ্রণালী:\\n${item.steps}`})}catch(e){}};
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><ScrollView>
  <Image source={{uri:item.image}} style={styles.detailImg}/><View style={styles.pad}>
   <View style={styles.detailHead}><View style={{flex:1}}><Text style={[styles.detailTitle,{color:dark?'#fff':'#222'}]}>{item.name}</Text><Text style={styles.muted}>{item.en}</Text></View><Pressable onPress={()=>toggle(item.id)}><Ionicons name={fav?'heart':'heart-outline'} size={34} color={fav?'#e53935':'#888'}/></Pressable></View>
   <Text style={styles.meta}>🌍 {item.country}   •   📂 {item.category}   •   ⏱️ {item.time} মিনিট   •   👥 {item.servings} জন   •   ⭐ {item.difficulty}</Text>
   <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>🧂 উপকরণ</Text>{item.ingredients.map((x,i)=><Text key={i} style={[styles.ing,{color:dark?'#eee':'#333'}]}>• {x}</Text>)}
   <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>👨‍🍳 রান্নার নিয়ম</Text><Text style={[styles.body,{color:dark?'#eee':'#333'}]}>{item.steps}</Text>
   <Text style={[styles.section,{color:dark?'#fff':'#222'}]}>💡 টিপস</Text><Text style={[styles.body,{color:dark?'#eee':'#333'}]}>{item.tips}</Text>
   <View style={styles.actions}><Pressable style={styles.action} onPress={share}><Text>🔗 শেয়ার</Text></Pressable><Pressable style={styles.action} onPress={copy}><Text>📋 উপকরণ কপি</Text></Pressable></View>
   <Pressable style={styles.timerBtn} onPress={()=>navigation.navigate('Timer')}><Text style={{color:'#fff',fontWeight:'800'}}>⏱️ রান্নার টাইমার চালু করুন</Text></Pressable>
  </View></ScrollView></SafeAreaView>
}

function Country({route,navigation,favorites,toggle,dark}) {
 const data=recipes.filter(r=>r.country===route.params.country);
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.pad}><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>🌍 {route.params.country}</Text><FlatList data={data} keyExtractor={x=>x.id} renderItem={({item})=><Card item={item} dark={dark} fav={favorites.includes(item.id)} onFav={()=>toggle(item.id)} onPress={()=>navigation.navigate('Details',{item})}/>/></View></SafeAreaView>
}

function Timer({dark}) {
 const [sec,setSec]=useState(300),[run,setRun]=useState(false),[input,setInput]=useState('5');
 useEffect(()=>{if(!run)return; const t=setInterval(()=>setSec(s=>{if(s<=1){clearInterval(t);setRun(false);Alert.alert('টাইমার শেষ!','রান্নার সময় শেষ হয়েছে।');return 0}return s-1}),1000);return()=>clearInterval(t)},[run]);
 const mins=Math.floor(sec/60), ss=String(sec%60).padStart(2,'0');
 return <SafeAreaView style={[styles.safe,{backgroundColor:dark?'#101010':'#f7f7f7'}]}><View style={styles.timer}><Text style={[styles.title,{color:dark?'#fff':'#222'}]}>⏱️ রান্নার টাইমার</Text><Text style={[styles.clock,{color:dark?'#fff':'#222'}]}>{mins}:{ss}</Text><View style={styles.timerRow}><TextInput keyboardType="numeric" value={input} onChangeText={setInput} style={[styles.timerInput,{color:dark?'#fff':'#222'}]}/><Text style={{color:dark?'#fff':'#222'}}> মিনিট</Text></View><View style={styles.actions}><Pressable style={styles.action} onPress={()=>setRun(!run)}><Text>{run?'⏸️ Pause':'▶️ Start'}</Text></Pressable><Pressable style={styles.action} onPress={()=>{setRun(false);setSec(Math.max(1,parseInt(input||'5')*60))}}><Text>🔄 Reset</Text></Pressable></View></View></SafeAreaView>
}

const Tab=createBottomTabNavigator(), Stack=createNativeStackNavigator();
function Tabs({favorites,toggle,dark,setDark}) {
 const [tab,setTab]=useState('Home');
 return <Tab.Navigator screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:'#e65b2a',tabBarStyle:{height:62,paddingBottom:7},tabBarIcon:({color,size})=>{const map={Home:'home',Search:'search',Favorites:'heart',Countries:'globe',Profile:'person'};return <Ionicons name={map[route.name]} size={size} color={color}/>}})}>
  <Tab.Screen name="Home">{p=><Home {...p} favorites={favorites} toggle={toggle} dark={dark} setTab={setTab}/>}</Tab.Screen>
  <Tab.Screen name="Search">{p=><Search {...p} favorites={favorites} toggle={toggle} dark={dark}/>}</Tab.Screen>
  <Tab.Screen name="Favorites">{p=><Favorites {...p} favorites={favorites} toggle={toggle} dark={dark}/>}</Tab.Screen>
  <Tab.Screen name="Countries">{p=><Countries {...p} dark={dark}/>}</Tab.Screen>
  <Tab.Screen name="Profile">{p=><Profile {...p} dark={dark} setDark={setDark}/>}</Tab.Screen>
 </Tab.Navigator>
}
export default function App(){
 const [favorites,setFavorites]=useState([]),[dark,setDark]=useState(false);
 useEffect(()=>{AsyncStorage.getItem('favorites').then(x=>x&&setFavorites(JSON.parse(x)));AsyncStorage.getItem('dark').then(x=>x&&setDark(x==='1'))},[]);
 const toggle=id=>setFavorites(a=>{const n=a.includes(id)?a.filter(x=>x!==id):[...a,id];AsyncStorage.setItem('favorites',JSON.stringify(n));return n});
 const theme=dark?NavDark:NavLight;
 return <NavigationContainer theme={theme}><StatusBar style={dark?'light':'dark'}/><Stack.Navigator><Stack.Screen name="Tabs" options={{headerShown:false}}>{p=><Tabs {...p} favorites={favorites} toggle={toggle} dark={dark} setDark={v=>{setDark(v);AsyncStorage.setItem('dark',v?'1':'0')}}/>}</Stack.Screen><Stack.Screen name="Details" component={Details} options={{title:'রেসিপি'}} initialParams={{}}/><Stack.Screen name="Country" options={{title:'দেশের রেসিপি'}}>{p=><Country {...p} favorites={favorites} toggle={toggle} dark={dark}/>}</Stack.Screen><Stack.Screen name="Timer" options={{title:'টাইমার'}}>{p=><Timer {...p} dark={dark}/>}</Stack.Screen></Stack.Navigator></NavigationContainer>
}

const styles=StyleSheet.create({
 safe:{flex:1},pad:{padding:16,flex:1},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},brand:{fontSize:29,fontWeight:'900'},title:{fontSize:26,fontWeight:'900',marginBottom:15},section:{fontSize:21,fontWeight:'900',marginTop:22,marginBottom:10},muted:{color:'#777',fontSize:13},searchBox:{height:50,borderRadius:15,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',paddingHorizontal:15,marginBottom:5,elevation:1},hero:{width:'100%',height:230,borderRadius:20},heroText:{position:'absolute',left:18,bottom:18},heroTitle:{fontSize:28,fontWeight:'900',color:'#fff',textShadowColor:'#000',textShadowRadius:5},card:{borderRadius:18,marginBottom:12,overflow:'hidden',elevation:2},cardImg:{width:'100%',height:155},cardBody:{padding:13,flexDirection:'row',alignItems:'center'},cardTitle:{fontSize:18,fontWeight:'800'},chip:{paddingHorizontal:15,paddingVertical:9,borderRadius:20,backgroundColor:'#fff',marginRight:8,marginBottom:5},activeChip:{backgroundColor:'#ffd8c9'},countryGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},country:{width:'48%',backgroundColor:'#fff',borderRadius:18,padding:15,marginBottom:12},empty:{alignItems:'center',justifyContent:'center',paddingTop:100},detailImg:{width:'100%',height:280},detailHead:{flexDirection:'row',alignItems:'center',marginBottom:10},detailTitle:{fontSize:30,fontWeight:'900'},meta:{backgroundColor:'#fff3ed',padding:12,borderRadius:14,lineHeight:23},ing:{fontSize:16,lineHeight:28},body:{fontSize:16,lineHeight:28},actions:{flexDirection:'row',gap:10,marginTop:18},action:{flex:1,backgroundColor:'#fff',padding:15,borderRadius:14,alignItems:'center',elevation:1},timerBtn:{marginTop:15,backgroundColor:'#e65b2a',padding:16,borderRadius:15,alignItems:'center'},timer:{flex:1,alignItems:'center',paddingTop:60},clock:{fontSize:70,fontWeight:'900',marginVertical:30},timerRow:{flexDirection:'row',alignItems:'center'},timerInput:{backgroundColor:'#fff',width:90,textAlign:'center',padding:12,borderRadius:12,fontSize:20},setting:{padding:18,borderRadius:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},about:{marginTop:20,padding:20,backgroundColor:'#fff',borderRadius:16,gap:8}
});