'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'identity',
		start:function(){
			"step 0"
			if(!lib.config.new_tutorial){
				ui.arena.classList.add('only_dialog');
			}
			_status.mode=get.config('identity_mode');
			if(_status.brawl&&_status.brawl.submode){
				_status.mode=_status.brawl.submode;
			}
			event.replacePile=function(){
				var list=['shengdong','qijia','caomu','jinchan','zengbin','fulei','qibaodao','zhungangshuo','lanyinjia'];
				var map={
					shunshou:'shengdong',
					jiedao:'qijia',
					bingliang:'caomu',
					wuxie:'jinchan',
					wuzhong:'zengbin',
					wugu:'zengbin',
					shandian:'fulei',
					qinggang:'qibaodao',
					qinglong:'zhungangshuo',
					bagua:'lanyinjia'
				};
				for(var i=0;i<lib.card.list.length;i++){
					var name=lib.card.list[i][2];
					if(list.contains(name)){
						lib.card.list.splice(i--,1);
					}
					else if(map[name]){
						lib.card.list[i][2]=map[name];
						lib.card.list[i]._replaced=true;
					}
				}
			}
			"step 1"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
			}
			else if(!_status.connectMode){
				if(_status.mode=='zhong'){
					if(get.config('zhong_card')){
						event.replacePile();
					}
					game.prepareArena(8);
				}
				else{
					game.prepareArena();
				}
				if(!lib.config.new_tutorial){
					game.delay();
				}
			}
			"step 2"
			if(!lib.config.new_tutorial){
				_status.new_tutorial=true;
				lib.init.onfree();
				game.saveConfig('version',lib.version);
				var clear=function(){
					ui.dialog.close();
					while(ui.controls.length) ui.controls[0].close();
				};
				var clear2=function(){
					ui.auto.show();
					ui.arena.classList.remove('only_dialog');
				};
				var step1=function(){
					ui.create.dialog('欢迎来到轩辕杀，是否进入新手向导？');
					game.saveConfig('new_tutorial',true);
					ui.dialog.add('<div class="text center">跳过后，你可以在选项-其它中重置新手向导');
					ui.auto.hide();
					ui.create.control('跳过向导',function(){
						clear();
						clear2();
						// game.resume();
						// lib.cheat.cfg(); // owidgets
					});
					ui.create.control('继续',step2);
				}
				var step2=function(){
					if(!lib.config.phonelayout){
						clear();
						ui.create.dialog('如果你在使用手机，可能会觉得按钮有点小'+
						'，将布局改成移动可以使按钮变大');
						ui.dialog.add('<div class="text center">你可以在选项-外观-布局中更改此设置');
						var lcontrol=ui.create.control('使用移动布局',function(){
							if(lib.config.phonelayout){
								ui.control.firstChild.firstChild.innerHTML='使用移动布局';
								game.saveConfig('phonelayout',false);
								lib.init.layout('mobile');
							}
							else{
								ui.control.firstChild.firstChild.innerHTML='使用默认布局';
								game.saveConfig('phonelayout',true);
								lib.init.layout('mobile');
							}
						});
						ui.create.control('继续',step3);
					}
					else{
						step3();
					}
				};
				var step3=function(){
					if(lib.config.touchscreen){
						clear();
						ui.create.dialog('触屏模式中，下划可以显示菜单，上划可以切换托管，双指单击可以暂停');
						ui.dialog.add('<div class="text center">你可以在选项-通用-中更改手势设置');
						ui.create.control('继续',step4);
					}
					else{
						step4();
					}
				};
				var step4=function(){
					clear();
					ui.window.classList.add('noclick_important');
					ui.click.configMenu();
					ui.control.classList.add('noclick_click_important');
					ui.control.style.top='calc(100% - 105px)';
					ui.create.control('在菜单中，可以进行各项设置',function(){
						ui.click.menuTab('选项');
						ui.controls[0].replace('如果你感到游戏较卡，可以开启流畅模式',function(){
							ui.controls[0].replace('在技能一栏中，可以设置自动发动或双将禁配的技能',function(){
								ui.click.menuTab('武将');
								ui.controls[0].replace('在武将或卡牌一栏中，单击武将/卡牌可以将其禁用',function(){
									ui.click.menuTab('战局');
									ui.controls[0].replace('在战局中可以输入游戏命令，或者管理录像',function(){
										ui.click.menuTab('帮助');
										ui.controls[0].replace('在帮助中，可以检查更新和下载素材',function(){
											ui.click.configMenu();
											ui.window.classList.remove('noclick_important');
											ui.control.classList.remove('noclick_click_important');
											ui.control.style.top='';
											step5();
										});
									});
								});
							});
						});
					})
				};
				var step5=function(){
					clear();
					ui.create.dialog('如果还有其它问题，欢迎来到百度轩辕杀吧进行交流');
					ui.create.control('完成',function(){
						clear();
						clear2();
						game.resume();
					})
				};
				game.pause();
				step1();
			}
			else{
				if(!_status.connectMode){
					game.showChangeLog();
				}
			}
			"step 3"
			if(typeof _status.new_tutorial=='function'){
				_status.new_tutorial();
			}
			delete _status.new_tutorial;
			if(_status.connectMode){
				game.waitForPlayer(function(){
					if(lib.configOL.identity_mode=='zhong'){
						lib.configOL.number=8;
					}
				});
			}
			"step 4"
			if(_status.connectMode){
				_status.mode=lib.configOL.identity_mode;
				if(_status.mode=='zhong'){
					lib.configOL.number=8;
					if(lib.configOL.zhong_card){
						event.replacePile();
					}
				}
				if(lib.configOL.number<2){
					lib.configOL.number=2;
				}
				game.randomMapOL();
			}
			else{
				for(var i=0;i<game.players.length;i++){
					game.players[i].getId();
				}
				if(_status.brawl&&_status.brawl.chooseCharacterBefore){
					_status.brawl.chooseCharacterBefore();
				}
				game.chooseCharacter();
			}
			"step 5"
			if(ui.coin){
				_status.coinCoeff=get.coinCoeff([game.me.name]);
			}
			if(game.players.length==2){
				game.showIdentity(true);
				var map={};
				for(var i in lib.playerOL){
					map[i]=lib.playerOL[i].identity;
				}
				game.broadcast(function(map){
					for(var i in map){
						lib.playerOL[i].identity=map[i];
						lib.playerOL[i].setIdentity();
						lib.playerOL[i].ai.shown=1;
					}
				},map);
			}
			else{
				for(var i=0;i<game.players.length;i++){
					game.players[i].ai.shown=0;
				}
			}
			if(game.zhu==game.me&&game.zhu.identity!='zhu'&&_status.brawl&&_status.brawl.identityShown){
				delete game.zhu;
			}
			else{
				game.zhu.ai.shown=1;
				if(game.zhu2){
					game.zhong=game.zhu;
					game.zhu=game.zhu2;
					delete game.zhu2;
					if(game.zhong.sex=='male'&&game.zhong.maxHp<=4){
						game.zhong.addSkill('dongcha');
					}
					else{
						game.zhong.addSkill('sheshen');
					}
				}
				var enhance_zhu=false;
				if(_status.connectMode){
					enhance_zhu=(_status.mode!='zhong'&&lib.configOL.enhance_zhu&&get.population('fan')>=3);
				}
				else{
					enhance_zhu=(_status.mode!='zhong'&&get.config('enhance_zhu')&&get.population('fan')>=3);
				}
				if(enhance_zhu){
					var skill;
					switch(game.zhu.name){
						case 'liubei':skill='jizhen';break;
						case 'dongzhuo':skill='hengzheng';break;
						case 'sunquan':skill='batu';break;
						case 'sp_zhangjiao':skill='tiangong';break;
						case 'liushan':skill='shengxi';break;
						case 'sunce':skill='ciqiu';break;
						case 'yuanshao':skill='geju';break;
						case 're_caocao':skill='dangping';break;
						case 'caopi':skill='junxing';break;
						case 'liuxie':skill='moukui';break;
						default:skill='tianming';break;
					}
					game.broadcastAll(function(player,skill){
						player.addSkill(skill);
						player.storage.enhance_zhu=skill;
					},game.zhu,skill);
				}
			}
			game.syncState();
			event.trigger('gameStart');

			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name,
					name2:players[i].name2,
					identity:players[i].identity
				});
			}
			_status.videoInited=true;
			game.addVideo('init',null,info);

			game.gameDraw(game.zhong||game.zhu||_status.firstAct||game.me);
			game.phaseLoop(game.zhong||game.zhu||_status.firstAct||game.me);
		},
		game:{
			getState:function(){
				var state={};
				for(var i in lib.playerOL){
					var player=lib.playerOL[i];
					state[i]={identity:player.identity};
					if(player==game.zhu){
						state[i].zhu=player.isZhu?true:false;
					}
					if(player==game.zhong){
						state[i].zhong=true;
					}
					if(player.special_identity){
						state[i].special_identity=player.special_identity;
					}
					state[i].shown=player.ai.shown;
				}
				return state;
			},
			updateState:function(state){
				for(var i in state){
					var player=lib.playerOL[i];
					if(player){
						player.identity=state[i].identity;
						if(state[i].special_identity){
							player.special_identity=state[i].special_identity;
							if(player.node.dieidentity){
								player.node.dieidentity.innerHTML=get.translation(state[i].special_identity);
								player.node.identity.firstChild.innerHTML=get.translation(state[i].special_identity+'_bg');
							}
						}
						if(typeof state[i].zhu=='boolean'){
							game.zhu=player;
							player.isZhu=state[i].zhu;
						}
						if(state[i].zhong){
							game.zhong=player;
						}
						player.ai.shown=state[i].shown;
					}
				}
			},
			getRoomInfo:function(uiintro){
				uiintro.add('<div class="text chat">游戏模式：'+(lib.configOL.identity_mode=='zhong'?'明忠':'标准'));
				uiintro.add('<div class="text chat">双将模式：'+(lib.configOL.double_character?'开启':'关闭'));
				if(lib.configOL.identity_mode!='zhong'){
					uiintro.add('<div class="text chat">双内奸：'+(lib.configOL.double_nei?'开启':'关闭'));
					uiintro.add('<div class="text chat">加强主公：'+(lib.configOL.enhance_zhu?'开启':'关闭'));
				}
				else{
					uiintro.add('<div class="text chat">卡牌替换：'+(lib.configOL.zhong_card?'开启':'关闭'));
				}
				var last=uiintro.add('<div class="text chat">出牌时限：'+lib.configOL.choose_timeout+'秒');
				// uiintro.add('<div class="text chat">屏蔽弱将：'+(lib.configOL.ban_weak?'开启':'关闭'));
				// var last=uiintro.add('<div class="text chat">屏蔽强将：'+(lib.configOL.ban_strong?'开启':'关闭'));
				if(lib.configOL.banned.length){
					last=uiintro.add('<div class="text chat">禁用武将：'+get.translation(lib.configOL.banned));
				}
				if(lib.configOL.bannedcards.length){
					last=uiintro.add('<div class="text chat">禁用卡牌：'+get.translation(lib.configOL.bannedcards));
				}
				last.style.paddingBottom='8px';
			},
			getIdentityList:function(player){
				if(player.identityShown) return;
				if(player==game.me) return;
				if(_status.mode=='zhong'){
					if(player.fanfixed) return;
					if(game.zhu&&game.zhu.isZhu){
						return {
							fan:'反',
							zhong:'忠',
							nei:'内',
							cai:'猜',
						}
					}
					else{
						return {
							fan:'反',
							zhong:'忠',
							nei:'内',
							zhu:'主',
							cai:'猜',
						}
					}
				}
				else{
					return {
						fan:'反',
						zhong:'忠',
						nei:'内',
						cai:'猜',
					}
				}
			},
			getIdentityList2:function(list){
				for(var i in list){
					switch(i){
						case 'fan':list[i]='反贼';break;
						case 'zhong':list[i]='忠臣';break;
						case 'nei':list[i]='内奸';break;
						case 'zhu':list[i]='主公';break;
						case 'cai':list[i]='未知';break;
					}
				}
			},
			getVideoName:function(){
				var str=get.translation(game.me.name);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var name=[
					str,
					get.cnNumber(get.playerNumber())+'人'+
						get.translation(lib.config.mode)+' - '+lib.translate[game.me.identity+'2']
				];
				return name;
			},
			addRecord:function(bool){
				if(typeof bool=='boolean'){
					var data=lib.config.gameRecord.identity.data;
					var identity=game.me.identity;
					if(identity=='mingzhong'){
						identity='zhong';
					}
					if(!data[identity]){
						data[identity]=[0,0];
					}
					if(bool){
						data[identity][0]++;
					}
					else{
						data[identity][1]++;
					}
					var list=['zhu','zhong','nei','fan'];
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							str+=lib.translate[list[i]+'2']+'：'+data[list[i]][0]+'胜'+' '+data[list[i]][1]+'负<br>';
						}
					}
					lib.config.gameRecord.identity.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
			showIdentity:function(me){
				for(var i=0;i<game.players.length;i++){
					// if(me===false&&game.players[i]==game.me) continue;
					game.players[i].node.identity.classList.remove('guessing');
					game.players[i].identityShown=true;
					game.players[i].ai.shown=1;
					game.players[i].setIdentity(game.players[i].identity);
					if(game.players[i].special_identity){
						game.players[i].node.identity.firstChild.innerHTML=get.translation(game.players[i].special_identity+'_bg');
					}
					if(game.players[i].identity=='zhu'){
						game.players[i].isZhu=true;
					}
				}
				if(_status.clickingidentity){
					for(var i=0;i<_status.clickingidentity[1].length;i++){
						_status.clickingidentity[1][i].delete();
						_status.clickingidentity[1][i].style.transform='';
					}
					delete _status.clickingidentity;
				}
			},
			checkResult:function(){
				if(_status.brawl&&_status.brawl.checkResult){
					_status.brawl.checkResult();
					return;
				}
				if(!game.zhu){
					if(get.population('fan')==0){
						switch(game.me.identity){
							case 'fan':game.over(false);break;
							case 'zhong':game.over(true);break;
							default:game.over();break;
						}
					}
					else if(get.population('zhong')==0){
						switch(game.me.identity){
							case 'fan':game.over(true);break;
							case 'zhong':game.over(false);break;
							default:game.over();break;
						}
					}
					return;
				}
				if(game.zhu.isAlive()&&get.population('fan')+get.population('nei')>0) return;
				if(game.zhong){
					game.zhong.identity='zhong';
				}
				game.showIdentity();
				if(game.me.identity=='zhu'||game.me.identity=='zhong'){
					if(game.zhu.classList.contains('dead')){
						game.over(false);
					}
					else{
						game.over(true);
					}
				}
				else if(game.me.identity=='nei'){
					if(game.players.length==1&&game.me.isAlive()){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}
				else{
					if((get.population('fan')+get.population('zhong')>0||get.population('nei')>1)&&
						game.zhu.classList.contains('dead')){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}
			},
			checkOnlineResult:function(player){
				if(game.zhu.isAlive()){
					return (player.identity=='zhu'||player.identity=='zhong');
				}
				else if(game.players.length==1&&game.players[0].identity=='nei'){
					return player.isAlive();
				}
				else{
					return player.identity=='fan';
				}
			},
			chooseCharacter:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.addPlayer=function(player){
					var list=lib.config.mode_config.identity.identity[game.players.length-3].slice(0);
					var list2=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);
					for(var i=0;i<list.length;i++) list2.remove(list[i]);
					player.identity=list2[0];
					player.setIdentity('cai');
				};
				next.removePlayer=function(){
					return game.players.randomGet(game.me,game.zhu);
				};
				next.ai=function(player,list,list2,back){
					if(_status.brawl&&_status.brawl.chooseCharacterAi){
						if(_status.brawl.chooseCharacterAi(player,list,list2,back)!==false){
							return;
						}
					}
					if(_status.event.zhongmode){
						if(get.config('double_character')){
							player.init(list[0],list[1]);
						}
						else{
							player.init(list[0]);
						}
						if(player.identity=='mingzhong'){
							player.hp++;
							player.maxHp++;
							player.update();
						}
					}
					else if(player.identity=='zhu'){
						list2.randomSort();
						var choice,choice2;
						if(!_status.event.zhongmode&&Math.random()-0.8<0&&list2.length){
							choice=list2[0];
							choice2=list[0];
							if(choice2==choice){
								choice2=list[1];
							}
						}
						else{
							choice=list[0];
							choice2=list[1];
						}
						if(get.config('double_character')){
							player.init(choice,choice2);
						}
						else{
							player.init(choice);
						}
						if(game.players.length>4){
							player.hp++;
							player.maxHp++;
							player.update();
						}
					}
					else if(player.identity=='zhong'&&(Math.random()<0.5||game.zhu.name=='sunliang')){
						var choice=0;
						for(var i=0;i<list.length;i++){
							if(lib.character[list[i]][1]==game.zhu.group){
								choice=i;break;
							}
						}
						if(get.config('double_character')){
							player.init(list[choice],list[choice==0?choice+1:choice-1]);
						}
						else{
							player.init(list[choice]);
						}
					}
					else{
						if(get.config('double_character')){
							player.init(list[0],list[1]);
						}
						else{
							player.init(list[0]);
						}
					}
					if(back){
						list.remove(player.name);
						list.remove(player.name2);
						for(var i=0;i<list.length;i++){
							back.push(list[i]);
						}
					}
					if(typeof lib.config.test_game=='string'&&player==game.me.next){
						player.init(lib.config.test_game);
					}
					if(get.config('choose_group')&&player.group=='shen'){
						    var list=lib.group.slice(0);
						    list.remove('shen');
						    if(list.length) player.group=function(){
						     if(_status.mode!='zhong'&&game.zhu&&game.zhu.group){
						      if(['liubei','re_liubei','caocao','re_caocao','sunquan','re_sunquan','zhangjiao','sp_zhangjiao','caopi','re_caopi','liuchen','caorui','sunliang','sunxiu'].contains(game.zhu.name)) return game.zhu.group;
						      if(game.zhu.name=='sunhao'&&player.identity=='zhong') return 'wu';
						      if(game.zhu.name=='yl_yuanshu'){
						       if(player.identity=='zhong') list.remove('qun');
						       else return 'qun';
						      }
						      if(['sunhao','xin_yuanshao','re_yuanshao'].contains(game.zhu.name)){
						       if(player.identity!='zhong') list.remove(game.zhu.group);
						       else return game.zhu.group;
						      }
						     }
						     return list.randomGet();
						    }();
						}
						player.node.name.dataset.nature=get.groupnature(player.group);
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var list;
					var list2=[];
					var list3=[];
					var identityList;
					var chosen=lib.config.continue_name||[];
					game.saveConfig('continue_name');
					event.chosen=chosen;
					if(_status.mode=='zhong'){
						event.zhongmode=true;
						identityList=['zhu','zhong','mingzhong','nei','fan','fan','fan','fan'];
					}
					else{
						identityList=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);
						if(get.config('double_nei')){
							switch(get.playerNumber()){
								case 8:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 7:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
								case 6:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 5:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 4:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
								case 3:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							}
						}
					}

					var addSetting=function(dialog){
						dialog.add('选择身份').classList.add('add-setting');
						var table=document.createElement('div');
						table.classList.add('add-setting');
						table.style.margin='0';
						table.style.width='100%';
						table.style.position='relative';
						var listi;
						if(event.zhongmode){
							listi=['random','zhu','mingzhong','zhong','nei','fan'];
						}
						else{
							listi=['random','zhu','zhong','nei','fan'];
						}

						for(var i=0;i<listi.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.link=listi[i];
							if(td.link===game.me.identity){
								td.classList.add('bluebg');
							}
							table.appendChild(td);
							td.innerHTML='<span>'+get.translation(listi[i]+'2')+'</span>';
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								_status.tempNoButton=true;
								setTimeout(function(){
									_status.tempNoButton=false;
								},500);
								var link=this.link;
								if(game.zhu.name){
									if(link!='random'){
										_status.event.parent.fixedseat=get.distance(game.me,game.zhu,'absolute');
									}
									game.zhu.uninit();
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								current=seats.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								if(link=='random'){
									if(event.zhongmode){
										link=['zhu','zhong','nei','fan','mingzhong'].randomGet();
									}
									else{
										link=['zhu','zhong','nei','fan'].randomGet();
									}
									for(var i=0;i<this.parentNode.childElementCount;i++){
										if(this.parentNode.childNodes[i].link==link){
											this.parentNode.childNodes[i].classList.add('bluebg');
										}
									}
								}
								else{
									this.classList.add('bluebg');
								}
								num=get.config('choice_'+link);
								if(event.zhongmode){
									num=6;
									if(link=='zhu'||link=='nei'||link=='mingzhong'){
										num=8;
									}
								}
								_status.event.parent.swapnodialog=function(dialog,list){
									var buttons=ui.create.div('.buttons');
									var node=dialog.buttons[0].parentNode;
									dialog.buttons=ui.create.buttons(list,'character',buttons);
									dialog.content.insertBefore(buttons,node);
									buttons.animate('start');
									node.remove();
									game.uncheck();
									game.check();
									for(var i=0;i<seats.childElementCount;i++){
										if(get.distance(game.zhu,game.me,'absolute')===seats.childNodes[i].link){
											seats.childNodes[i].classList.add('bluebg');
										}
									}
								}
								_status.event=_status.event.parent;
								_status.event.step=0;
								_status.event.identity=link;
								if(link!=(event.zhongmode?'mingzhong':'zhu')){
									seats.previousSibling.style.display='';
									seats.style.display='';
								}
								else{
									seats.previousSibling.style.display='none';
									seats.style.display='none';
								}
								game.resume();
							});
						}
						dialog.content.appendChild(table);

						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('div');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=2;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(game.zhu,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(game.zhu,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								for(var i=0;i<game.players.length;i++){
									if(get.distance(game.players[i],game.me,'absolute')==this.link){
										game.swapSeat(game.zhu,game.players[i],false);return;
									}
								}
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;
					event.list=[];
					identityList.randomSort();
					if(event.identity){
						identityList.remove(event.identity);
						identityList.unshift(event.identity);
						if(event.fixedseat){
							var zhuIdentity=(_status.mode=='zhong')?'mingzhong':'zhu';
							if(zhuIdentity!=event.identity){
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat,0,zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					}
					else if(_status.mode!='zhong'&&(!_status.brawl||!_status.brawl.identityShown)){
						var ban_identity=[];
						ban_identity.push(get.config('ban_identity')||'off');
						if(ban_identity[0]!='off'){
							ban_identity.push(get.config('ban_identity2')||'off');
							if(ban_identity[1]!='off'){
								ban_identity.push(get.config('ban_identity3')||'off');
							}
						}
						ban_identity.remove('off');
						if(ban_identity.length){
							var identityList2=identityList.slice(0);
							for(var i=0;i<ban_identity.length;i++){
								while(identityList2.remove(ban_identity[i]));
							}
							ban_identity=identityList2.randomGet();
							identityList.remove(ban_identity);
							identityList.splice(game.players.indexOf(game.me),0,ban_identity);
						}
					}
					for(i=0;i<game.players.length;i++){
						if(_status.brawl&&_status.brawl.identityShown){
							if(game.players[i].identity=='zhu') game.zhu=game.players[i];
							game.players[i].identityShown=true;
						}
						else{
							game.players[i].node.identity.classList.add('guessing');
							game.players[i].identity=identityList[i];
							game.players[i].setIdentity('cai');
							if(event.zhongmode){
								if(identityList[i]=='mingzhong'){
									game.zhu=game.players[i];
								}
								else if(identityList[i]=='zhu'){
									game.zhu2=game.players[i];
								}
							}
							else{
								if(identityList[i]=='zhu'){
									game.zhu=game.players[i];
								}
							}
							game.players[i].identityShown=false;
						}
					}

					if(get.config('special_identity')&&!event.zhongmode&&game.players.length==8){
						for(var i=0;i<game.players.length;i++){
							delete game.players[i].special_identity;
						}
						event.special_identity=[];
						var zhongs=game.filterPlayer(function(current){
							return current.identity=='zhong';
						});
						var fans=game.filterPlayer(function(current){
							return current.identity=='fan';
						});
						if(fans.length>=1){
							fans.randomRemove().special_identity='identity_zeishou';
							event.special_identity.push('identity_zeishou');
						}
						if(zhongs.length>1){
							zhongs.randomRemove().special_identity='identity_dajiang';
							zhongs.randomRemove().special_identity='identity_junshi';
							event.special_identity.push('identity_dajiang');
							event.special_identity.push('identity_junshi');
						}
						else if(zhongs.length==1){
							if(Math.random()<0.5){
								zhongs.randomRemove().special_identity='identity_dajiang';
								event.special_identity.push('identity_dajiang');
							}
							else{
								zhongs.randomRemove().special_identity='identity_junshi';
								event.special_identity.push('identity_junshi');
							}
						}
					}

					if(!game.zhu) game.zhu=game.me;
					else{
						game.zhu.setIdentity();
						game.zhu.identityShown=true;
						game.zhu.isZhu=(game.zhu.identity=='zhu');
						game.zhu.node.identity.classList.remove('guessing');
						game.me.setIdentity();
						game.me.node.identity.classList.remove('guessing');
					}
					for(i in lib.character){
						if(chosen.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						event.list.push(i);
						if(lib.character[i][4]&&lib.character[i][4].contains('zhu')){
							list2.push(i);
						}
						else{
							list3.push(i);
						}
					}
					event.list.randomSort();
					list3.randomSort();
					if(_status.brawl&&_status.brawl.chooseCharacterFilter){
						_status.brawl.chooseCharacterFilter(event.list,list2,list3);
					}
					var num=get.config('choice_'+game.me.identity);
					if(event.zhongmode){
						num=6;
						if(game.me.identity=='zhu'||game.me.identity=='nei'||game.me.identity=='mingzhong'){
							num=8;
						}
					}
					if(game.zhu!=game.me){
						event.ai(game.zhu,event.list,list2)
						event.list.remove(game.zhu.name);
						event.list.remove(game.zhu.name2);
						if(_status.brawl&&_status.brawl.chooseCharacter){
							list=_status.brawl.chooseCharacter(event.list,num);
							if(list===false||list==='nozhu'){
								list=event.list.slice(0,num);
							}
						}
						else{
							list=event.list.slice(0,num);
						}
					}
					else{
						if(_status.brawl&&_status.brawl.chooseCharacter){
							list=_status.brawl.chooseCharacter(list2,list3,num);
							if(list===false){
								if(event.zhongmode){
									list=list3.slice(0,6);
								}
								else{
									list=list2.concat(list3.slice(0,num));
								}
							}
							else if(list==='nozhu'){
								list=event.list.slice(0,num);
							}
						}
						else{
							if(event.zhongmode){
								list=list3.slice(0,8);
							}
							else{
								list=list2.concat(list3.slice(0,num));
							}
						}
					}
					delete event.swapnochoose;
					var dialog;
					if(event.swapnodialog){
						dialog=ui.dialog;
						event.swapnodialog(dialog,list);
						delete event.swapnodialog;
					}
					else{
						var str='选择角色';
						if(_status.brawl&&_status.brawl.chooseCharacterStr){
							str=_status.brawl.chooseCharacterStr;
						}
						dialog=ui.create.dialog(str,'hidden',[list,'character']);
						if(!_status.brawl||!_status.brawl.noAddSetting){
							if(get.config('change_identity')){
								addSetting(dialog);
							}
						}
					}
					if(game.me.special_identity){
						dialog.setCaption('选择角色（'+get.translation(game.me.special_identity)+'）');
						game.me.node.identity.firstChild.innerHTML=get.translation(game.me.special_identity+'_bg');
					}
					else{
						dialog.setCaption('选择角色');
						game.me.setIdentity();
					}
					if(!event.chosen.length){
						game.me.chooseButton(dialog,true).set('onfree',true).selectButton=function(){
							if(_status.brawl&&_status.brawl.doubleCharacter) return 2;
							return get.config('double_character')?2:1
						};
					}
					else{
						lib.init.onfree();
					}
					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							if(game.changeCoin){
								game.changeCoin(-3);
							}
							if(game.zhu!=game.me){
								event.list.randomSort();
								if(_status.brawl&&_status.brawl.chooseCharacter){
									list=_status.brawl.chooseCharacter(event.list,num);
									if(list===false||list==='nozhu'){
										list=event.list.slice(0,num);
									}
								}
								else{
									list=event.list.slice(0,num);
								}
							}
							else{
								list3.randomSort();
								if(_status.brawl&&_status.brawl.chooseCharacter){
									list=_status.brawl.chooseCharacter(list2,list3,num);
									if(list===false){
										if(event.zhongmode){
											list=list3.slice(0,6);
										}
										else{
											list=list2.concat(list3.slice(0,num));
										}
									}
									else if(list==='nozhu'){
										event.list.randomSort();
										list=event.list.slice(0,num);
									}
								}
								else{
									if(event.zhongmode){
										list=list3.slice(0,6);
									}
									else{
										list=list2.concat(list3.slice(0,num));
									}
								}
							}
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list,'character',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}

					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						if(lib.onfree){
							ui.cheat2.classList.add('disabled');
						}
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice'))
						ui.create.cheat();
						if(!ui.cheat2&&get.config('free_choose'))
						ui.create.cheat2();
					}
					"step 1"
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					var chooseGroup=false;
					if(event.chosen.length){
						if(lib.character[event.chosen[0]][1]=='shen'){
						    chooseGroup=true;
						}
					}
					else if(event.modchosen){
						if(event.modchosen[0]=='random') event.modchosen[0]=result.buttons[0].link;
						else event.modchosen[1]=result.buttons[0].link;
					}
					else if(result.buttons.length==2){
						event.choosed=[result.buttons[0].link,result.buttons[1].link];
						game.addRecentCharacter(result.buttons[0].link,result.buttons[1].link);
						if(lib.character[event.choosed[0]][1]=='shen'){
						    chooseGroup=true;
						}
					}
					else{
						event.choosed=[result.buttons[0].link];
						if(lib.character[event.choosed[0]][1]=='shen'){
						    chooseGroup=true;
						}
						game.addRecentCharacter(result.buttons[0].link);
					}
					if(get.config('choose_group')&&chooseGroup){
					     var list=lib.group.slice(0);
						    list.remove('shen');
						    game.me.chooseControl(list).prompt='请选择神武将的势力';
					}
					"step 2"
					event.group=result.control||false;
					if(event.chosen.length){
						game.me.init(event.chosen[0],event.chosen[1]);
					}
					else if(event.modchosen){
						game.me.init(event.modchosen[0],event.modchosen[1]);
					}
					else if(event.choosed.length==2){
						game.me.init(event.choosed[0],event.choosed[1]);
					}
					else{
						game.me.init(event.choosed[0]);
					}
					event.list.remove(game.me.name);
					event.list.remove(game.me.name2);
					if(game.me==game.zhu&&game.players.length>4){
						game.me.hp++;
						game.me.maxHp++;
						game.me.update();
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.zhu&&game.players[i]!=game.me){
							event.list.randomSort();
							event.ai(game.players[i],event.list.splice(0,get.config('choice_'+game.players[i].identity)),null,event.list)
						}
					}
					"step 3"
					if(event.group){
					    game.me.group=event.group;
					    game.me.node.name.dataset.nature=get.groupnature(game.me.group);
					    game.me.update();
					}
					"step 4"
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);

					if(event.special_identity){
						for(var i=0;i<event.special_identity.length;i++){
							game.zhu.addSkill(event.special_identity[i]);
						}
					}
				});
			},
			chooseCharacterOL:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var identityList;
					if(_status.mode=='zhong'){
						event.zhongmode=true;
						identityList=['zhu','zhong','mingzhong','nei','fan','fan','fan','fan'];
					}
					else{
						identityList=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);
						if(lib.configOL.double_nei){
							switch(lib.configOL.number){
								case 8:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 7:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
								case 6:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 5:
								identityList.remove('fan');
								identityList.push('nei');
								break;
								case 4:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
								case 3:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							}
						}
					}
					identityList.randomSort();
					for(i=0;i<game.players.length;i++){
						game.players[i].identity=identityList[i];
						game.players[i].setIdentity('cai');
						game.players[i].node.identity.classList.add('guessing');
						if(event.zhongmode){
							if(identityList[i]=='mingzhong'){
								game.zhu=game.players[i];
							}
							else if(identityList[i]=='zhu'){
								game.zhu2=game.players[i];
							}
						}
						else{
							if(identityList[i]=='zhu'){
								game.zhu=game.players[i];
							}
						}
						game.players[i].identityShown=false;
					}
					if(lib.configOL.special_identity&&!event.zhongmode&&game.players.length==8){
						var map={};
						var zhongs=game.filterPlayer(function(current){
							return current.identity=='zhong';
						});
						var fans=game.filterPlayer(function(current){
							return current.identity=='fan';
						});
						if(fans.length>=1){
							map.identity_zeishou=fans.randomRemove();
						}
						if(zhongs.length>1){
							map.identity_dajiang=zhongs.randomRemove();
							map.identity_junshi=zhongs.randomRemove();
						}
						else if(zhongs.length==1){
							if(Math.random()<0.5){
								map.identity_dajiang=zhongs.randomRemove();
							}
							else{
								map.identity_junshi=zhongs.randomRemove();
							}
						}
						game.broadcastAll(function(zhu,map){
							for(var i in map){
								map[i].special_identity=i;
							}
						},game.zhu,map);
						event.special_identity=map;
					}

					game.zhu.setIdentity();
					game.zhu.identityShown=true;
					game.zhu.isZhu=(game.zhu.identity=='zhu');
					game.zhu.node.identity.classList.remove('guessing');
					game.me.setIdentity();
					game.me.node.identity.classList.remove('guessing');
					if(game.me.special_identity){
						game.me.node.identity.firstChild.innerHTML=get.translation(game.me.special_identity+'_bg');
					}

					for(var i=0;i<game.players.length;i++){
						game.players[i].send(function(zhu,zhuid,me,identity){
							for(var i in lib.playerOL){
								lib.playerOL[i].setIdentity('cai');
								lib.playerOL[i].node.identity.classList.add('guessing');
							}
							zhu.identityShown=true;
							zhu.identity=zhuid;
							zhu.setIdentity();
							zhu.node.identity.classList.remove('guessing');
							me.setIdentity(identity);
							me.node.identity.classList.remove('guessing');
							if(me.special_identity){
								me.node.identity.firstChild.innerHTML=get.translation(me.special_identity+'_bg');
							}
							ui.arena.classList.add('choose-character');
						},game.zhu,game.zhu.identity,game.players[i],game.players[i].identity);
					}

					var list;
					var list2=[];
					var list3=[];
					event.list=[];
					event.list2=[];

					var libCharacter={};
					for(var i=0;i<lib.configOL.characterPack.length;i++){
						var pack=lib.characterPack[lib.configOL.characterPack[i]];
						for(var j in pack){
							if(j=='zuoci'||j=='miheng') continue;
							if(lib.character[j]) libCharacter[j]=pack[j];
						}
					}
					for(i in libCharacter){
						if(lib.filter.characterDisabled(i,libCharacter)) continue;
						event.list.push(i);
						event.list2.push(i);
						if(libCharacter[i][4]&&libCharacter[i][4].contains('zhu')){
							list2.push(i);
						}
						else{
							list3.push(i);
						}
					}
					if(event.zhongmode){
						list=event.list.randomGets(8);
					}
					else{
						list=list2.concat(list3.randomGets(3));
					}
					var next=game.zhu.chooseButton(true);
					next.set('selectButton',(lib.configOL.double_character?2:1));
					next.set('createDialog',['选择角色',[list,'character']]);
					next.set('callback',function(player,result){
						player.init(result.links[0],result.links[1]);
					});
					next.set('ai',function(button){
						return Math.random();
					});
					"step 1"
					if(game.me!=game.zhu){
						game.zhu.init(result.links[0],result.links[1])
					}
					event.list.remove(game.zhu.name);
					event.list.remove(game.zhu.name2);
					event.list2.remove(game.zhu.name);
					event.list2.remove(game.zhu.name2);

					if(game.players.length>4){
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
					game.broadcast(function(zhu,name,name2,addMaxHp){
						if(game.zhu!=game.me){
							zhu.init(name,name2);
						}
						if(addMaxHp){
							zhu.maxHp++;
							zhu.hp++;
							zhu.update();
						}
					},game.zhu,game.zhu.name,game.zhu.name2,game.players.length>4);

					var list=[];
					var selectButton=(lib.configOL.double_character?2:1);

					var num,num2=0;
					if(event.zhongmode){
						num=6;
					}
					else{
						num=Math.floor(event.list.length/(game.players.length-1));
						num2=event.list.length-num*(game.players.length-1);
						if(lib.configOL.double_nei){
							num2=Math.floor(num2/2);
						}
						if(num>5){
							num=5;
						}
						if(num2>2){
							num2=2;
						}
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.zhu){
							var num3=0;
							if(event.zhongmode){
								if(game.players[i].identity=='nei'||game.players[i].identity=='zhu'){
									num3=2;
								}
							}
							else{
								if(game.players[i].identity=='nei'){
									num3=num2;
								}
							}
							var str='选择角色';
							if(game.players[i].special_identity){
								str+='（'+get.translation(game.players[i].special_identity)+'）';
							}
							list.push([game.players[i],[str,[event.list.randomRemove(num+num3),'character']],selectButton,true]);
						}
					}
					game.me.chooseButtonOL(list,function(player,result){
						if(game.online||player==game.me) player.init(result.links[0],result.links[1]);
					});
					"step 2"
					for(var i in result){
						if(result[i]&&result[i].links){
							for(var j=0;j<result[i].links.length;j++){
								event.list2.remove(result[i].links[j]);
							}
						}
					}
					for(var i in result){
						if(result[i]=='ai'){
							result[i]=event.list2.randomRemove(lib.configOL.double_character?2:1);
						}
						else{
							result[i]=result[i].links
						}
						if(!lib.playerOL[i].name){
							lib.playerOL[i].init(result[i][0],result[i][1]);
						}
					}
					if(event.special_identity){
						for(var i in event.special_identity){
							game.zhu.addSkill(i);
						}
					}
					game.broadcast(function(result){
						for(var i in result){
							if(!lib.playerOL[i].name){
								lib.playerOL[i].init(result[i][0],result[i][1]);
							}
						}
						setTimeout(function(){
							ui.arena.classList.remove('choose-character');
						},500);
					},result);
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
		},
		translate:{
			zhu:"主",
			zhong:"忠",
			mingzhong:"忠",
			nei:"内",
			fan:"反",
			cai:"猜",
			zhu2:"主公",
			zhong2:"忠臣",
			mingzhong2:"明忠",
			nei2:"内奸",
			fan2:"反贼",
			random2:"随机",
			identity_junshi_bg:'师',
			identity_dajiang_bg:'将',
			identity_zeishou_bg:'首',
			identity_junshi:'军师',
			identity_dajiang:'大将',
			identity_zeishou:'贼首',
			ai_strategy_1:'均衡',
			ai_strategy_2:'偏反',
			ai_strategy_3:'偏主',
			ai_strategy_4:'酱油',
			ai_strategy_5:'天使',
			ai_strategy_6:'仇主',
			dongcha:'洞察',
			dongcha_info:'游戏开始时，随机一名反贼的身份对你可见；准备阶段，你可以弃置场上的一张牌',
			sheshen:'舍身',
			sheshen_info:'锁定技，主公处于濒死状态即将死亡时，令主公+1体力上限，回复体力至X点（X为你的体力值数），获得你的所有牌，然后你死亡',
		},
		element:{
			player:{
				$dieAfter:function(){
					if(_status.video) return;
					if(!this.node.dieidentity){
						var str;
						if(this.special_identity){
							str=get.translation(this.special_identity);
						}
						else{
							str=get.translation(this.identity+'2');
						}
						var node=ui.create.div('.damage.dieidentity',str,this);
						ui.refresh(node);
						node.style.opacity=1;
						this.node.dieidentity=node;
					}
					var trans=this.style.transform;
					if(trans){
						if(trans.indexOf('rotateY')!=-1){
							this.node.dieidentity.style.transform='rotateY(180deg)';
						}
						else if(trans.indexOf('rotateX')!=-1){
							this.node.dieidentity.style.transform='rotateX(180deg)';
						}
						else{
							this.node.dieidentity.style.transform='';
						}
					}
					else{
						this.node.dieidentity.style.transform='';
					}
				},
				dieAfter2:function(source){
					if(this.identity=='fan'&&source) source.draw(3);
					else if(this.identity=='mingzhong'&&source){
						if(source.identity=='zhu'){
							source.discard(source.getCards('he'));
						}
						else{
							source.draw(3);
						}
					}
					else if(this.identity=='zhong'&&source&&source.identity=='zhu'&&source.isZhu){
						source.discard(source.getCards('he'));
					}
				},
				dieAfter:function(source){
					if(!this.identityShown){
						game.broadcastAll(function(player,identity,identity2){
							player.setIdentity(player.identity);
							player.identityShown=true;
							player.node.identity.classList.remove('guessing');
							if(identity){
								player.node.identity.firstChild.innerHTML=get.translation(identity+'_bg');
								game.log(player,'的身份是','#g'+get.translation(identity));
							}
							else{
								game.log(player,'的身份是','#g'+get.translation(identity2+'2'));
							}
						},this,this.special_identity,this.identity);
					}
					if(this.special_identity){
						game.broadcastAll(function(zhu,identity){
							zhu.removeSkill(identity);
						},game.zhu,this.special_identity);
					}
					game.checkResult();
					if(game.zhu&&game.zhu.isZhu){
						if(get.population('zhong')+get.population('nei')==0||
						get.population('zhong')+get.population('fan')==0){
							game.broadcastAll(game.showIdentity);
						}
					}
					if(game.zhu&&game.zhu.storage.enhance_zhu&&get.population('fan')<3){
						game.zhu.removeSkill(game.zhu.storage.enhance_zhu);
						delete game.zhu.storage.enhance_zhu;
					}
					if(this==game.zhong){
						game.broadcastAll(function(player){
							game.zhu=player;
							game.zhu.identityShown=true;
							game.zhu.ai.shown=1;
							game.zhu.setIdentity();
							game.zhu.isZhu=true;
							game.zhu.node.identity.classList.remove('guessing');
							if(lib.config.animation&&!lib.config.low_performance) game.zhu.$legend();
							delete game.zhong;
							if(_status.clickingidentity&&_status.clickingidentity[0]==game.zhu){
								for(var i=0;i<_status.clickingidentity[1].length;i++){
									_status.clickingidentity[1][i].delete();
									_status.clickingidentity[1][i].style.transform='';
								}
								delete _status.clickingidentity;
							}
						},game.zhu);
						game.delay(2);
						game.zhu.playerfocus(1000);
						_status.event.trigger('zhuUpdate');
					}

					if(!_status.over){
						var giveup;
						if(get.population('fan')+get.population('nei')==1){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].identity=='fan'||game.players[i].identity=='nei'){
									giveup=game.players[i];break;
								}
							}
						}
						else if(get.population('zhong')+get.population('mingzhong')+get.population('nei')==0){
							giveup=game.zhu;
						}
						if(giveup){
							giveup.showGiveup();
						}
					}

				},
				logAi:function(targets,card){
					if(this.ai.shown==1||this.isMad()) return;
					if(typeof targets=='number'){
						this.ai.shown+=targets;
					}
					else{
						var effect=0,c,shown;
						var info=get.info(card);
						if(info.ai&&info.ai.expose){
							if(_status.event.name=='_wuxie'){
								if(_status.event.source&&_status.event.source.ai.shown){
									this.ai.shown+=0.2;
								}
							}
							else{
								this.ai.shown+=info.ai.expose;
							}
						}
						if(targets.length>0){
							for(var i=0;i<targets.length;i++){
								shown=Math.abs(targets[i].ai.shown);
								if(shown<0.2||targets[i].identity=='nei') c=0;
								else if(shown<0.4) c=0.5;
								else if(shown<0.6) c=0.8;
								else c=1;
								var eff=get.effect(targets[i],card,this);
								effect+=eff*c;
								if(eff==0&&shown==0&&this.identity=='zhong'&&targets[i]!=this){
									effect+=0.1;
								}
							}
						}
						if(effect>0){
							if(effect<1) c=0.5;
							else c=1;
							if(targets.length==1&&targets[0]==this);
							else if(targets.length==1) this.ai.shown+=0.2*c;
							else this.ai.shown+=0.1*c;
						}
						else if(effect<0&&this==game.me&&game.me.identity!='nei'){
							if(targets.length==1&&targets[0]==this);
							else if(targets.length==1) this.ai.shown-=0.2;
							else this.ai.shown-=0.1;
						}
					}
					if(this!=game.me) this.ai.shown*=2;
					if(this.ai.shown>0.95) this.ai.shown=0.95;
					if(this.ai.shown<-0.5) this.ai.shown=-0.5;

					var marknow=(!_status.connectMode&&this!=game.me&&get.config('auto_mark_identity')&&this.ai.identity_mark!='finished');
					// if(true){
						if(marknow&&_status.clickingidentity&&_status.clickingidentity[0]==this){
							for(var i=0;i<_status.clickingidentity[1].length;i++){
								_status.clickingidentity[1][i].delete();
								_status.clickingidentity[1][i].style.transform='';
							}
							delete _status.clickingidentity;
						}
						if(!Array.isArray(targets)){
							targets=[];
						}
						var effect=0,c,shown;
						var zhu=game.zhu;
						if(_status.mode=='zhong'&&!game.zhu.isZhu){
							zhu=game.zhong;
						}
						if(targets.length==1&&targets[0]==this){
							effect=0;
						}
						else if(this.identity!='nei'){
							if(this.ai.shown>0){
								if(this.identity=='fan'){
									effect=-1;
								}
								else{
									effect=1;
								}
							}
						}
						else if(targets.length>0){
							for(var i=0;i<targets.length;i++){
								shown=Math.abs(targets[i].ai.shown);
								if(shown<0.2||targets[i].identity=='nei') c=0;
								else if(shown<0.4) c=0.5;
								else if(shown<0.6) c=0.8;
								else c=1;
								effect+=get.effect(targets[i],card,this,zhu)*c;
							}
						}
						if(this.identity=='nei'){
							if(effect>0){
								if(this.ai.identity_mark=='fan'){
									if(marknow) this.setIdentity();
									this.ai.identity_mark='finished';
								}
								else{
									if(marknow) this.setIdentity('zhong');
									this.ai.identity_mark='zhong';
								}
							}
							else if(effect<0&&get.population('fan')>0){
								if(this.ai.identity_mark=='zhong'){
									if(marknow) this.setIdentity();
									this.ai.identity_mark='finished';
								}
								else{
									if(marknow) this.setIdentity('fan');
									this.ai.identity_mark='fan';
								}
							}
						}
						else if(marknow){
							if(effect>0&&this.identity!='fan'){
								this.setIdentity('zhong');
								this.ai.identity_mark='finished';
							}
							else if(effect<0&&this.identity=='fan'){
								this.setIdentity('fan');
								this.ai.identity_mark='finished';
							}
						}
					// }

				},
				showIdentity:function(){
					this.node.identity.classList.remove('guessing');
					this.identityShown=true;
					this.ai.shown=1;
					this.setIdentity();
					if(this.special_identity){
						this.node.identity.firstChild.innerHTML=get.translation(game.players[i].special_identity+'_bg');
					}
					if(this.identity=='zhu'){
						this.isZhu=true;
					}
					else{
						delete this.isZhu;
					}
					if(_status.clickingidentity){
						for(var i=0;i<_status.clickingidentity[1].length;i++){
							_status.clickingidentity[1][i].delete();
							_status.clickingidentity[1][i].style.transform='';
						}
						delete _status.clickingidentity;
					}
				}
			}
		},
		get:{
			rawAttitude:function(from,to){
				var x=0,num=0,temp,i;
				if(_status.ai.customAttitude){
					for(i=0;i<_status.ai.customAttitude.length;i++){
						temp=_status.ai.customAttitude[i](from,to);
						if(temp!=undefined){
							x+=temp;
							num++;
						}
					}
				}
				if(num){
					return x/num;
				}
				var difficulty=0;
				if(to==game.me) difficulty=2-get.difficulty();
				if(from==to||to.identityShown||(from.storage.dongcha==to)){
					return get.realAttitude(from,to)+difficulty*1.5;
				}
				else{
					if(from.identity=='zhong'&&to.ai.shown==0&&from.ai.tempIgnore&&
						!from.ai.tempIgnore.contains(to)){
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].ai.shown==0&&game.players[i].identity=='fan'){
								return -0.1+difficulty*1.5;
							}
						}
					}
					var aishown=to.ai.shown;
					if(to.identity=='nei'&&to.ai.shown<1&&(to.ai.identity_mark=='fan'||to.ai.identity_mark=='zhong')){
						aishown=0.5;
					}
					else if(aishown==0&&to.identity!='fan'&&to.identity!='zhu'){
						var fanshown=true;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].identity=='fan'&&game.players[i].ai.shown==0&&game.players[i]!=from){
								fanshown=false;break;
							}
						}
						if(fanshown) aishown=0.3;
					}
					return get.realAttitude(from,to)*aishown+difficulty*1.5;
				}
			},
			realAttitude:function(from,to){
				if(!game.zhu){
					if(from.identity=='nei'||to.identity=='nei') return -1;
					if(from.identity==to.identity) return 6;
					return -6;
				}
				var situation=get.situation();
				var identity=from.identity;
				var identity2=to.identity;
				if(identity2=='zhu'&&!to.isZhu){
					identity2='zhong';
					if(from==to) return 10;
				}
				if(from!=to&&to.identity=='nei'&&to.ai.shown<1&&(to.ai.identity_mark=='fan'||to.ai.identity_mark=='zhong')){
					identity2=to.ai.identity_mark;
				}
				if(from.identity!='nei'&&from!=to&&get.population('fan')==0&&identity2=='zhong'){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].identity=='nei'&&
						game.players[i].ai.identity_mark=='zhong'&&
						game.players[i].ai.shown<1){
							identity2='nei';break;
						}
					}
				}
				var zhongmode=false;
				if(!game.zhu.isZhu){
					zhongmode=true;
				}
				switch(identity){
					case 'zhu':
						switch(identity2){
							case 'zhu': return 10;
							case 'zhong':case 'mingzhong': return 6;
							case 'nei':
								if(game.players.length==2) return -10;
								if(to.identity=='zhong') return 0;
								if(get.population('fan')==0){
									if(to.ai.identity_mark=='zhong'&&to.ai.shown<1) return 0;
									return -0.5;
								}
								if(zhongmode&&to.ai.sizhong&&to.ai.shown<1) return 6;
								if(get.population('fan')==1&&get.population('nei')==1&&game.players.length==3){
									var fan;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='fan'){
											fan=game.players[i];break;
										}
									}
									if(fan){
										if(to.hp>1&&to.hp>fan.hp&&to.countCards('he')>fan.countCards('he')){
											return -3;
										}
									}
									return 0;
								}
								if(situation>1) return 0;
								return Math.min(3,get.population('fan'));
							case 'fan':
								if(get.population('fan')==1&&get.population('nei')==1&&game.players.length==3){
									var nei;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='nei'){
											nei=game.players[i];break;
										}
									}
									if(nei){
										if(nei.hp>1&&nei.hp>to.hp&&nei.countCards('he')>to.countCards('he')){
											return 0;
										}
									}
									return -3;
								}
								return -4;
						}
						break;
					case 'zhong':case 'mingzhong':
						switch(identity2){
							case 'zhu': return 10;
							case 'zhong':case 'mingzhong': return 4;
							case 'nei':
								if(get.population('fan')==0) return -2;
								if(zhongmode&&to.ai.sizhong&&to.ai.shown<1) return 6;
								return Math.min(3,-situation);
							case 'fan': return -8;
						}
						break;
					case 'nei':
						if(identity2=='zhu'&&game.players.length==2) return -10;
						var strategy=get.aiStrategy();
						if(strategy==4){
							if(from==to) return 10;
							return 0;
						}
						var num;
						switch(identity2){
							case 'zhu':
								if(strategy==6) return -1;
								if(strategy==5) return 10;
								if(to.hp<=0) return 10;
								if(get.population('fan')==1){
									var fan;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='fan'){
											fan=game.players[i];break;
										}
									}
									if(fan){
										if(to.hp>1&&to.hp>fan.hp&&to.countCards('he')>fan.countCards('he')){
											return -3;
										}
									}
									return 0;
								}
								else{
									if(situation>1||get.population('fan')==0) num=0;
									else num=get.population('fan')+Math.max(0,3-game.zhu.hp);
								}
								if(strategy==2) num--;
								if(strategy==3) num++;
								return num;
							case 'zhong':
								if(strategy==5) return Math.min(0,-situation);
								if(strategy==6) return Math.max(-1,-situation);
								if(get.population('fan')==0) num=-5;
								else if(situation<=0) num=0;
								else if(game.zhu&&game.zhu.hp<2) num=0;
								else if(game.zhu&&game.zhu.hp==2) num=-1;
								else if(game.zhu&&game.zhu.hp<=2&&situation>1) num=-1;
								else num=-2;
								if(zhongmode&&situation<2){
									num=4;
								}
								if(strategy==2) num--;
								if(strategy==3) num++;
								return num;
							case 'mingzhong':
								if(zhongmode){
									if(from.ai.sizhong==undefined){
										from.ai.sizhong=(Math.random()<0.5);
									}
									if(from.ai.sizhong) return 6;
								}
								if(strategy==5) return Math.min(0,-situation);
								if(strategy==6) return Math.max(-1,-situation);
								if(get.population('fan')==0) num=-5;
								else if(situation<=0) num=0;
								else num=-3;
								if(strategy==2) num--;
								if(strategy==3) num++;
								return num;
							case 'nei':
								if(from==to) return 10;
								if(from.ai.friend.contains(to)) return 5;
								if(get.population('fan')+get.population('zhong')>0) return 0;
								return -5;
							case 'fan':
								if(strategy==5) return Math.max(-1,situation);
								if(strategy==6) return Math.min(0,situation);
								if((game.zhu&&game.zhu.hp<=2&&situation<0)||situation<-1) num=-3;
								else if(situation<0||get.population('zhong')+get.population('mingzhong')==0) num=-2;
								else if((game.zhu&&game.zhu.hp>=4&&situation>0)||situation>1) num=1;
								else num=0;
								if(strategy==2) num++;
								if(strategy==3) num--;
								return num;
						}
						break;
					case 'fan':
						switch(identity2){
							case 'zhu':
								if(get.population('nei')>0){
									if(situation==1) return -6;
									if(situation>1) return -5;
								}
								return -8;
							case 'zhong':
								if(!zhongmode&&game.zhu.hp>=3&&to.hp==1){
									return -10;
								}
								return -7;
							case 'mingzhong':return -5;
							case 'nei':
								if(zhongmode&&to.ai.sizhong) return -7;
								if(get.population('fan')==1) return 0;
								if(get.population('zhong')+get.population('mingzhong')==0) return -7;
								if(game.zhu&&game.zhu.hp<=2) return -1;
								return Math.min(3,situation);
							case 'fan': return 5;
						}
				}
			},
			situation:function(absolute){
				var i,j,player;
				var zhuzhong=0,total=0,zhu,fan=0;
				for(i=0;i<game.players.length;i++){
					player=game.players[i];
					var php=player.hp;
					if(player.hasSkill('benghuai')&&php>4){
						php=4;
					}
					else if(php>6){
						php=6;
					}
					j=player.countCards('h')+player.countCards('e')*1.5+php*2;
					if(player.identity=='zhu'){
						zhuzhong+=j*1.2+5;
						total+=j*1.2+5;
						zhu=j;
					}
					else if(player.identity=='zhong'||player.identity=='mingzhong'){
						zhuzhong+=j*0.8+3;
						total+=j*0.8+3;
					}
					else if(player.identity=='fan'){
						zhuzhong-=j+4;
						total+=j+4;
						fan+=j+4;
					}
				}
				if(absolute) return zhuzhong;
				var result=parseInt(10*Math.abs(zhuzhong/total));
				if(zhuzhong<0) result=-result;
				if(!game.zhong){
					if(zhu<12&&fan>30) result--;
					if(zhu<6&&fan>15) result--;
					if(zhu<4) result--;
				}
				return result;
			},
		},
		skill:{
			identity_junshi:{
				name:'军师',
				mark:true,
				intro:{
					content:'准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底'
				},
				trigger:{player:'phaseBegin'},
				silent:true,
				content:function(){
					"step 0"
					if(player.isUnderControl()){
						game.modeSwapPlayer(player);
					}
					var num=3;
					var cards=get.cards(num);
					event.cards=cards;
					var switchToAuto=function(){
						_status.imchoosing=false;
						if(event.dialog) event.dialog.close();
						if(event.control) event.control.close();
						var top=[];
						var judges=player.node.judges.childNodes;
						var stopped=false;
						if(!player.countCards('h','wuxie')){
							for(var i=0;i<judges.length;i++){
								var judge=get.judge(judges[i]);
								cards.sort(function(a,b){
									return judge(b)-judge(a);
								});
								if(judge(cards[0])<0){
									stopped=true;break;
								}
								else{
									top.unshift(cards.shift());
								}
							}
						}
						var bottom;
						if(!stopped){
							cards.sort(function(a,b){
								return get.value(b,player)-get.value(a,player);
							});
							while(cards.length){
								if(get.value(cards[0],player)<=5) break;
								top.unshift(cards.shift());
							}
						}
						bottom=cards;
						for(var i=0;i<top.length;i++){
							ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
						}
						for(i=0;i<bottom.length;i++){
							ui.cardPile.appendChild(bottom[i]);
						}
						player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
						game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
						game.delay(2);
					};
					var chooseButton=function(online,player,cards){
						var event=_status.event;
						player=player||event.player;
						cards=cards||event.cards;
						event.top=[];
						event.bottom=[];
						event.status=true;
						event.dialog=ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('pointerdiv');
						}
						event.switchToAuto=function(){
							event._result='ai';
							event.dialog.close();
							event.control.close();
							_status.imchoosing=false;
						},
						event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
							var event=_status.event;
							if(link=='ok'){
								if(online){
									event._result={
										top:[],
										bottom:[]
									}
									for(var i=0;i<event.top.length;i++){
										event._result.top.push(event.top[i].link);
									}
									for(var i=0;i<event.bottom.length;i++){
										event._result.bottom.push(event.bottom[i].link);
									}
								}
								else{
									var i;
									for(i=0;i<event.top.length;i++){
										ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
									}
									for(i=0;i<event.bottom.length;i++){
										ui.cardPile.appendChild(event.bottom[i].link);
									}
									for(i=0;i<event.dialog.buttons.length;i++){
										if(event.dialog.buttons[i].classList.contains('glow')==false&&
											event.dialog.buttons[i].classList.contains('target')==false)
										ui.cardPile.appendChild(event.dialog.buttons[i].link);
									}
									player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
									game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
								}
								event.dialog.close();
								event.control.close();
								game.resume();
								_status.imchoosing=false;
							}
							else if(link=='pileTop'){
								event.status=true;
								event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
							}
							else{
								event.status=false;
								event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
							}
						})
						for(var i=0;i<event.dialog.buttons.length;i++){
							event.dialog.buttons[i].classList.add('selectable');
						}
						event.custom.replace.button=function(link){
							var event=_status.event;
							if(link.classList.contains('target')){
								link.classList.remove('target');
								event.top.remove(link);
							}
							else if(link.classList.contains('glow')){
								link.classList.remove('glow');
								event.bottom.remove(link);
							}
							else if(event.status){
								link.classList.add('target');
								event.top.unshift(link);
							}
							else{
								link.classList.add('glow');
								event.bottom.push(link);
							}
						}
						event.custom.replace.window=function(){
							for(var i=0;i<_status.event.dialog.buttons.length;i++){
								_status.event.dialog.buttons[i].classList.remove('target');
								_status.event.dialog.buttons[i].classList.remove('glow');
								_status.event.top.length=0;
								_status.event.bottom.length=0;
							}
						}
						game.pause();
						game.countChoose();
					};
					event.switchToAuto=switchToAuto;

					if(event.isMine()){
						chooseButton();
						event.finish();
					}
					else if(event.isOnline()){
						event.player.send(chooseButton,true,event.player,event.cards);
						event.player.wait();
						game.pause();
					}
					else{
						event.switchToAuto();
						event.finish();
					}
					"step 1"
					if(event.result=='ai'||!event.result){
						event.switchToAuto();
					}
					else{
						var top=event.result.top||[];
						var bottom=event.result.bottom||[];
						for(var i=0;i<top.length;i++){
							ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
						}
						for(i=0;i<bottom.length;i++){
							ui.cardPile.appendChild(bottom[i]);
						}
						for(i=0;i<event.cards.length;i++){
							if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
								ui.cardPile.appendChild(event.cards[i]);
							}
						}
						player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
						game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
						game.delay(2);
					}
				}
			},
			identity_dajiang:{
				name:'大将',
				mark:true,
				intro:{
					content:'手牌上限+1'
				},
				mod:{
					maxHandcard:function(player,num){
						return num+1;
					}
				}
			},
			identity_zeishou:{
				name:'贼首',
				mark:true,
				intro:{
					content:'手牌上限-1'
				},
				mod:{
					maxHandcard:function(player,num){
						return num-1;
					}
				}
			},
			dongcha:{
				trigger:{player:'phaseBegin'},
				direct:true,
				unique:true,
				filter:function(event,player){
					return game.hasPlayer(function(current){
						return current.countCards('ej');
					});
				},
				forceunique:true,
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt('dongcha'),function(card,player,target){
						return target.countCards('ej')>0;
					}).set('ai',function(target){
						var player=_status.event.player;
						var att=get.attitude(player,target);

						if(att>0){
							var js=target.getCards('j');
							if(js.length){
								var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
								if(jj.name=='guohe'||js.length>1||get.effect(target,jj,target,player)<0){
									return 2*att;
								}
							}
							if(target.getEquip('baiyin')&&target.isDamaged()&&
								get.recoverEffect(target,player,player)>0){
								if(target.hp==1&&!target.hujia) return 1.6*att;
								if(target.hp==2) return 0.01*att;
								return 0;
							}
						}
						var es=target.getCards('e');
						var noe=target.hasSkillTag('noe');
						var noe2=(es.length==1&&es[0].name=='baiyin'&&target.isDamaged());
						if(noe||noe2) return 0;
						if(att<=0&&!es.length) return 1.5*att;
						return -1.5*att;
					});
					'step 1'
					if(result.bool){
						event.target=result.targets[0];
						event.target.addExpose(0.1);
						player.logSkill('dongcha',event.target);
						game.delayx();
					}
					else{
						event.finish();
					}
					'step 2'
					if(event.target){
						player.discardPlayerCard('ej',true,event.target);
					}
				},
				group:['dongcha_begin','dongcha_log'],
				subSkill:{
					begin:{
						trigger:{global:'gameStart'},
						forced:true,
						popup:false,
						content:function(){
							var list=[];
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].identity=='fan'){
									list.push(game.players[i]);
								}
							}
							var target=list.randomGet();
							player.storage.dongcha=target;
							if(!_status.connectMode){
								if(player==game.me){
									target.setIdentity('fan');
									target.node.identity.classList.remove('guessing');
									target.fanfixed=true;
									player.line(target,'green');
									player.popup('dongcha');
								}
							}
							else{
								player.chooseControl('ok').set('dialog',[get.translation(target)+'是反贼',[[target.name],'character']]);
							}
						}
					},
					log:{
						trigger:{player:'useCard'},
						forced:true,
						popup:false,
						filter:function(event,player){
							return event.targets.length==1&&event.targets[0]==player.storage.dongcha&&event.targets[0].ai.shown<0.95;
						},
						content:function(){
							trigger.targets[0].addExpose(0.2);
						}
					}
				}
			},
			sheshen:{
				trigger:{global:'dieBefore'},
				forced:true,
				unique:true,
				forceunique:true,
				filter:function(event,player){
					return event.player==game.zhu&&player.hp>0;
				},
				logTarget:'player',
				content:function(){
					'step 0'
					trigger.player.gainMaxHp();
					'step 1'
					var dh=player.hp-trigger.player.hp;
					if(dh>0){
						trigger.player.recover(dh);
					}
					'step 2'
					var cards=player.getCards('he');
					if(cards.length){
						trigger.player.gain(cards,player);
						player.$giveAuto(cards,trigger.player);
					}
					'step 3'
					trigger.cancel();
					player.die();
				}
			}
		},
		help:{
			'身份模式':'<div style="margin:10px">选项</div><ul style="margin-top:0"><li>加强主公<br>反贼人数多于2时主公会额外增加一个技能（每个主公的额外技能固定，非常备主公增加天命）<li>特殊身份<br><ul style="padding-left:20px;padding-top:5px"><li>军师：忠臣身份。只要军师存活，主公在准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底<li>大将：忠臣身份。只要大将存活，主公手牌上限+1<li>贼首：反贼身份，只要贼首存活，主公手牌上限-1</ul></ul>'+
			'<div style="margin:10px">明忠</div><ul style="margin-top:0"><li>本模式需要8名玩家进行游戏，使用的身份牌为：1主公、2忠臣、4反贼和1内奸。游戏开始时，每名玩家随机获得一个身份，由系统随机选择一名忠臣身份的玩家亮出身份（将忠臣牌正面朝上放在面前），其他身份（包括主公）的玩家不亮出身份。<li>'+
			'首先由亮出身份的忠臣玩家随机获得六张武将牌，挑选一名角色，并将选好的武将牌展示给其他玩家。之后其余每名玩家随机获得三张武将牌，各自从其中挑选一张同时亮出<li>'+
			'亮出身份牌的忠臣增加1点体力上限。角色濒死和死亡的结算及胜利条件与普通身份局相同。',
		}
	};
});